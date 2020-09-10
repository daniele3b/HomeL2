const express = require("express");
const router = express.Router();
var multer = require("multer");
const path = require("path");
const config = require("config");
const {
  RemoveEscapeChar,
  PandocDocx2Md,
} = require("../startup/templateLoader");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "models");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

var upload = multer({ storage: storage });

router.post(
  "/loadingTemplate",
  upload.single("file"),
  async (req, res, next) => {
    const file = req.file;
    if (!file) {
      res.status(400).send("Bad request!");
    } else {
      //Creating template
      var moveTo = config.get("template_location_output");
      const moveFrom = config.get("models_location");
      const fromPath = path.join(moveFrom, file.originalname);
      var toPath = path.join(moveTo, file.originalname);
      toPath = toPath.replace(".docx", ".md");
      await PandocDocx2Md(fromPath, toPath);
      await RemoveEscapeChar(toPath);
      res.status(200).send("File loaded!");
    }
  }
);

router.get("/loadingTemplate", async (req, res) => {
  res.sendFile(path.join(__dirname, "../views", "loadingTemplate.html"));
});

module.exports = router;
