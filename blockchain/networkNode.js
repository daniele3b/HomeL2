const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const Blockchain = require("./blockchain");

const config = require("config");
const port = config.get("port");

const request = require("request-promise");

const ledger = new Blockchain();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

router.get("/blockchain", (req, res) => {
  res.send(ledger);
});

router.post("/transaction", (req, res) => {
  const newTransaction = req.body.newTransaction;

  const blockIndex = ledger.addTransactionToPendingTransactions(newTransaction);

  res.json({ note: "Transaction will be added in block " + blockIndex + "." });
});

router.post("/transaction/broadcast", (req, res) => {
  const newTransaction = ledger.createNewTransaction(
    req.body.userData,
    req.body.signature,
    req.body.publicKey
  );
  ledger.addTransactionToPendingTransactions(newTransaction);

  let requestPromises = [];

  ledger.networkNodes.forEach((networkNodeUrl) => {
    const requestOptions = {
      uri: networkNodeUrl + "/transaction",
      method: "POST",
      body: { newTransaction: newTransaction },
      json: true,
    };

    requestPromises.push(request(requestOptions));
  });

  Promise.all(requestPromises).then((data) => {
    res.json({ note: "Transaction created and broadcast successfully." });
  });
});

router.get("/mine", (req, res) => {
  const lastBlock = ledger.getLastBlock();
  const previousBlockHash = lastBlock["hash"];
  const currentBlockData = {
    transactions: ledger.pendingTransactions,
    index: lastBlock["index"] + 1,
  };

  const blockHash = ledger.hashBlock(previousBlockHash, currentBlockData);

  const newBlock = ledger.createNewBlock(previousBlockHash, blockHash);

  const requestPromises = [];

  ledger.networkNodes.forEach((networkNodeUrl) => {
    const requestOptions = {
      uri: networkNodeUrl + "/receive-new-block",
      method: "POST",
      body: { newBlock: newBlock },
      json: true,
    };

    requestPromises.push(request(requestOptions));
  });

  Promise.all(requestPromises).then((data) => {
    res.json({
      note: "New block mined & broadcasted successfully",
      block: newBlock,
    });
  });
});

router.post("/receive-new-block", (req, res) => {
  const newBlock = req.body.newBlock;

  const lastBlock = ledger.getLastBlock();
  const correctHash = lastBlock.hash === newBlock.previousBlockHash;
  const correctIndex = lastBlock["index"] + 1 == newBlock["index"];

  if (correctHash && correctIndex) {
    ledger.chain.push(newBlock);
    ledger.pendingTransactions = [];
    res.json({
      note: "New block received and accepted",
      newBlock: newBlock,
    });
  } else {
    res.json({
      note: "New block rejected",
      newBlock: newBlock,
    });
  }
});

// Register a node and broadcast to the network (ON ITS OWN SERVER)
router.post("/register-and-broadcast-node", (req, res) => {
  // Register
  const newNodeUrl = req.body.newNodeUrl;
  if (ledger.networkNodes.indexOf(newNodeUrl) == -1)
    ledger.networkNodes.push(newNodeUrl);

  const regNodesPromises = [];

  // Broadcast
  ledger.networkNodes.forEach((networkNodeUrl) => {
    // We hit '/register-node'
    const requestOptions = {
      uri: networkNodeUrl + "/register-node",
      method: "POST",
      body: { newNodeUrl: newNodeUrl },
      json: true,
    };

    regNodesPromises.push(request(requestOptions));
  });

  Promise.all(regNodesPromises)
    .then((data) => {
      const bulkRegisterOptions = {
        uri: newNodeUrl + "/register-nodes-bulk",
        method: "POST",
        body: {
          allNetworkNodes: [...ledger.networkNodes, ledger.currentNodeUrl],
        },
        json: true,
      };

      return request(bulkRegisterOptions);
    })
    .then((data) => {
      res.json({ note: "New node registered with network successfully." });
    });
});

// Register a node with the network
router.post("/register-node", (req, res) => {
  const newNodeUrl = req.body.newNodeUrl;
  const nodeNotAlreadyPresent = ledger.networkNodes.indexOf(newNodeUrl) == -1;
  const notCurrentNode = ledger.currentNodeUrl !== newNodeUrl;
  if (nodeNotAlreadyPresent && notCurrentNode)
    ledger.networkNodes.push(newNodeUrl);
  res.json({ note: "New node registered successfully." });
});

// Register multiple nodes at once  (bulk == massa)
router.post("/register-nodes-bulk", (req, res) => {
  const allNetworkNodes = req.body.allNetworkNodes;
  allNetworkNodes.forEach((networkNodeUrl) => {
    const nodeNotAlreadyPresent =
      ledger.networkNodes.indexOf(networkNodeUrl) == -1;
    const notCurrentNode = ledger.currentNodeUrl !== networkNodeUrl;
    if (nodeNotAlreadyPresent && notCurrentNode)
      ledger.networkNodes.push(networkNodeUrl);
  });

  res.json({ note: "Bulk registration successfull." });
});

router.get("/consensus", (req, res) => {
  const requestPromises = [];

  ledger.networkNodes.forEach((networkNodeUrl) => {
    const requestOptions = {
      uri: networkNodeUrl + "/blockchain",
      method: "GET",
      json: true,
    };

    requestPromises.push(request(requestOptions));
  });

  Promise.all(requestPromises).then((blockchains) => {
    const currentChainLenght = ledger.chain.length;
    let maxChainLength = currentChainLenght;
    let newLongestChain = null;
    let newPendingTransactions = null;

    blockchains.forEach((blockchain) => {
      if (blockchain.chain.length > maxChainLength) {
        maxChainLength = blockchain.chain.length;
        newLongestChain = blockchain.chain;
        newPendingTransactions = blockchain.pendingTransactions;
      }
    });

    if (
      !newLongestChain ||
      (newLongestChain && !ledger.chainIsValid(newLongestChain))
    ) {
      res.json({
        note: "Current chain has not been replaced.",
        chain: ledger.chain,
      });
    } else if (newLongestChain && ledger.chainIsValid(newLongestChain)) {
      ledger.chain = newLongestChain;
      ledger.pendingTransactions = newPendingTransactions;

      res.json({
        note: "This chain has been replaced.",
        chain: ledger.chain,
      });
    }
  });
});

module.exports = router;

/*app.listen(port, function(){
    console.log("Listening on port "+port+"...")
})*/
