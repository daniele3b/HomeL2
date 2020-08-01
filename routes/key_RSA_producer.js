const express = require("express");
const router = express.Router();
const { KeyGenerator } = require("../helper/keyGenerator");

router.get("/generatePublicKey", async (req, res) => {
  const publicKey = KeyGenerator();

  //Switch security to RSA
  process.env["ASYM_ENC_ACTIVE"] = "yes";

  res.status(200).send(publicKey);
});

module.exports = router;
