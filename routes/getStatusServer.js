const express = require("express");
const router = express.Router();

router.get("/getStatusServer", (req, res) => {
    res.status(200).send("Server online!")
});

module.exports = router;
