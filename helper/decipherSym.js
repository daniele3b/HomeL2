const crypto = require("crypto");
const config = require("config");
require("dotenv").config();

const Cryptr = require("cryptr");

function decipherSym(data) {
  const cryptr = new Cryptr(process.env.PW_CIPHER);
  const decryptedString = cryptr.decrypt(data);
  console.log(decryptedString);
  return JSON.parse(decryptedString);
}

exports.decipherSym = decipherSym;
