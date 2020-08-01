const express = require("express");
const router = express.Router();
const { KeyGenerator } = require("../helper/keyGenerator");

router.get("/generatePublicKey", async (req, res) => {
  const publicKey = KeyGenerator();

  //Switcho a chiave pubblica

  try {
    const { stdout, stderr } = await exec("set ASYM_ENC_ACTIVE=yes");
    console.log("stdout:", stdout);
    console.log("stderr:", stderr);
  } catch {
    (err) => {
      console.error(err);
    };
  }

  res.status(200).send(publicKey);
});

module.exports = router;
