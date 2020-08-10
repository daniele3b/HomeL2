const express = require("express");
const router = express.Router();
const config = require("config")
require("dotenv").config()

router.get("/getStatusServer", (req, res) => {
    
    if(config.get("security_active") == "yes"){
        if(process.env.ASYM_ENC_ACTIVE == "yes") res.status(200).send({encoding: "asymmetric"})
        else res.status(200).send({encoding: "symmetric"})
    }

    else res.status(200).send("Service is active!")
    
});

module.exports = router;
