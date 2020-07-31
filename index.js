const { receiveInfo } = require("./amqp/consumer.js");
const { GenerateTemplate } = require("./startup/templateLoader");

const config = require("config");

if (config.get("blockChainActive") == "yes") {
  var cors = require("cors");
  const { mine } = require("./helper/mine");
  const port = config.get("port");
  const express = require("express");
  var app = express();
  var bodyParser = require("body-parser");

  app.use(cors());
  //setting bodyparser
  app.use(bodyParser.json({ limit: "50mb" }));
  app.use(
    bodyParser.urlencoded({
      limit: "50mb",
      extended: true,
      parameterLimit: 50000,
    })
  );
  //setting routes blockchain
  require("./startup/routes")(app);
  app.listen(port, function () {
    console.log("Listening on port " + port + "...");
  });

  //set time mine
  setInterval(() => {
    mine();
  }, config.get("time_mine"));
}

GenerateTemplate();

receiveInfo();
