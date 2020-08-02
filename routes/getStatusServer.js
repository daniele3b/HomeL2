const express = require("express");
const router = express.Router();
const config = require("config")
require("dotenv").config()

router.get("/getStatusServer", (req, res) => {
    
    if(process.env.ASYM_ENC_ACTIVE == "yes") res.status(200).send({encoding: "asymmetric"})
    else res.status(200).send({encoding: "symmetric"})
});

module.exports = router;
