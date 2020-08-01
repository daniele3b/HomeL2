const fs = require("fs");
const { generateKeyPair } = require("crypto");
const crypto = require("crypto");
const config = require("config");
require("dotenv").config();

var EC = require("elliptic").ec;

function DigitalSign(file) {
  // Create and initialize EdDSA context
  var ec = new EC(config.get("ec_curve_name"));
  //read file to sign
  const doc = fs.readFileSync(file);
  //generate pait of key
  var key = ec.genKeyPair();

  //create digest and sign it
  var shaMsg = crypto
    .createHash(config.get("hashing_function"))
    .update(doc)
    .digest();
  var signature = key.sign(shaMsg);

  //get the public key to save in blockchain with signature
  var pubPoint = key.getPublic();
  var pub = pubPoint.encode("hex");

  return { signature: signature, publickey: pub };
}

exports.DigitalSign = DigitalSign;
