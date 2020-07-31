const { receiveInfo } = require("./amqp/consumer.js");
const { GenerateTemplate } = require("./startup/templateLoader");

const config = require("config");

if (config.get("blockChainActive") == "yes") {
  const request = require("request-promise");
  const port = config.get("port");
  const express = require("express");
  var app = express();

  var bodyParser = require("body-parser");
  app.use(bodyParser.json({ limit: "50mb" }));
  app.use(
    bodyParser.urlencoded({
      limit: "50mb",
      extended: true,
      parameterLimit: 50000,
    })
  );
  require("./startup/routes")(app);
  app.listen(port, function () {
    console.log("Listening on port " + port + "...");
  });

  //set time mine
  setInterval(() => {
    var options = {
      uri: config.get("currentNodeUrl") + config.get("port") + "/mine",
      method: "GET",
      json: true,
    };

    request(options).then(() => {
      console.log("Block Mined! \n");
    });
  }, config.get("time_mine"));
}

GenerateTemplate();

receiveInfo();
