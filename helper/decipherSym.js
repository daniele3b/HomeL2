const crypto = require("crypto");
const config = require("config");
require("dotenv").config();

function decipherSym(data) {
  const algorithm = config.get("algorithm_cipher");
  const password = process.env.PW_CIPHER;
  const key = crypto.scryptSync(password, "salt", 24);
  // The IV is usually passed along with the ciphertext.
  const iv = Buffer.alloc(16, 0); // Initialization vector.

  const decipher = crypto.createDecipheriv(algorithm, key, iv);

  let decrypted = decipher.update(data, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}

exports.decipherSym = decipherSym;
