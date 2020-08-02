const Blockchain = require("../blockchain/networkNode");
const key_RSA_producer = require("../routes/key_RSA_producer");
const getStatusServer = require("../routes/getStatusServer");
const bodyParser = require("body-parser");
const config = require("config");

module.exports = function (app) {
  app.use("/", Blockchain);
  if (config.get("security_active") == "yes") {
    app.use("/", key_RSA_producer);
    app.use("/", getStatusServer);
  }
};
