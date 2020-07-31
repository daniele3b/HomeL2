const Blockchain = require("../blockchain/networkNode");
const bodyParser = require("body-parser");

module.exports = function (app) {
  app.use("/", Blockchain);
};
