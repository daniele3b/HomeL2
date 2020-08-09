const crypto = require("crypto");

function digitalSignatureRSA(file) {
  let { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
    // The standard secure default length for RSA keys is 2048 bits
    modulusLength: 2048,
  });

  const doc = fs.readFileSync(file);
  const sign = crypto.createSign("RSA-SHA256");
  sign.update(doc);
  var signature = sign.sign(privateKey, "hex");
  publicKey = publicKey.export({
    type: "pkcs1",
    format: "pem",
  });

  return { signature: signature, publickey: publicKey };
}

exports.digitalSignatureRSA = digitalSignatureRSA;
