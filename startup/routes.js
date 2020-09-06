const Blockchain = require("../blockchain/networkNode");
const key_RSA_producer = require("../routes/key_RSA_producer");
const getStatusServer = require("../routes/getStatusServer");
const config = require("config");

module.exports = function (app) {
  if(config.get("blockChainActive") == "yes"){
    app.use("/", Blockchain);
  }

  app.use("/", getStatusServer);

  if (config.get("security_active") == "yes") {
    app.use("/", key_RSA_producer);
  }
  
};
