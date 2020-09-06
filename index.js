const { receiveInfo } = require("./amqp/consumer.js");
const { GenerateTemplate } = require("./startup/templateLoader");

const config = require("config");

var cors = require("cors");
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

require("./startup/routes")(app);

app.listen(port, function () {
  console.log("Listening on port " + port + "...");
});



if (config.get("blockChainActive") == "yes") {
  const { mine } = require("./helper/mine");

  //set time mine
  setInterval(() => {
    mine();
  }, config.get("time_mine"));
}

GenerateTemplate();

receiveInfo();
