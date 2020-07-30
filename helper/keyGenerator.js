const crypto = require("crypto");
const config = require("config");
require("dotenv").config();
const { generateKeyPairSync } = require("crypto");
const { writeFileSync } = require("fs");

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
      passphrase: "top secret",
    },
  });
  var r = crypto.publicEncrypt(
    publicKey,
    Buffer.from(JSON.stringify({ nome: "daniele", cognome: "bufalieri" }))
  );
  console.log(r);

  var decrypted = crypto.privateDecrypt(
    {
      key: privateKey,
      passphrase: "top secret",
    },
    Buffer.from(r)
  );

  var x = decrypted.toString();
  x = JSON.parse(x);
  console.log(x);
}

exports.KeyGenerator = KeyGenerator;
