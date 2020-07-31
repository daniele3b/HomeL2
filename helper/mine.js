const request = require("request-promise");
const config = require("config");

function mine() {
  var options = {
    uri: config.get("currentNodeUrl") + config.get("port") + "/mine",
    method: "GET",
    json: true,
  };

  request(options)
    .then(() => {
      console.log("Block Mined! \n");
    })
    .catch((err) => {
      console.log("Error during mine: " + err);
    });
}

exports.mine = mine;
