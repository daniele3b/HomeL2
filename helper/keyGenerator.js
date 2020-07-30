const crypto = require("crypto");
const config = require("config");
require("dotenv").config();
const { generateKeyPairSync } = require("crypto");

var randomstring = require("randomstring");
const passphrase = randomstring.generate();

function KeyGenerator() {
  const { publicKey, privateKey } = generateKeyPairSync("rsa", {
    modulusLength: 4096,
    publicKeyEncoding: {
      type: "spki",
      format: "pem",
    },
    privateKeyEncoding: {
      type: "pkcs8",
      format: "pem",
      cipher: "aes-256-cbc",
      passphrase: passphrase,
    },
  });
  var data = encryptData({ nome: "daniele", cognome: "bufalieri" }, publicKey);
  console.log(decryptData(data, privateKey));
}

function encryptData(data, publicKey) {
  var dataCrypted = crypto.publicEncrypt(
    publicKey,
    Buffer.from(JSON.stringify(data))
  );
  return dataCrypted;
}
function decryptData(dataCrypted, privateKey) {
  var decrypted = crypto.privateDecrypt(
    {
      key: privateKey,
      passphrase: passphrase,
    },
    Buffer.from(dataCrypted)
  );

  var data = decrypted.toString();
  data = JSON.parse(data);
  return data;
}

exports.KeyGenerator = KeyGenerator;
