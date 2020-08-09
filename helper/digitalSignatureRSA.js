const crypto = require("crypto");

function digitalSignatureRSA(file) {
  let { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
    // The standard secure default length for RSA keys is 2048 bits
    modulusLength: 2048,
  });

  const doc = fs.readFileSync(file);

  const signature = crypto.sign("sha256", Buffer.from(doc), {
    key: privateKey,
    padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
  });

  publicKey = publicKey.export({
    type: "pkcs1",
    format: "pem",
  });

  return { signature: signature, publickey: publicKey };
}

exports.digitalSignatureRSA = digitalSignatureRSA;
