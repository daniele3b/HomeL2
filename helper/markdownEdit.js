fs = require("fs");
const config = require("config");
const util = require("util");
const { emailSender } = require("./emailSender");
const exec = util.promisify(require("child_process").exec);
const { DigitalSign } = require("../helper/digitalSignature");
const axios = require("axios");
var randomstring = require("randomstring");
const { parse, stringify } = require("flatted");

async function Pandoc(src, out) {
  try {
    const { stdout, stderr } = await exec(
      "pandoc " + src + " --template " + src + "  | pandoc -o " + out
    );
    console.log("stdout:", stdout);
    console.log("stderr:", stderr);
  } catch {
    (err) => {
      console.error(err);
    };
  }
}

function markdownEditFile(data, name_file) {
  return new Promise(function (resolve, reject) {
    if (data.lang == "eng") {
      fs.writeFile(
        config.get("tmp_location") + name_file + ".md",
        "--- \n name: " +
          data.name +
          "\n surname: " +
          data.surname +
          "\n day: " +
          data.month +
          "/" +
          data.day +
          "/" +
          data.year +
          "\n street: " +
          data.street +
          "\n cash: " +
          data.cash +
          "\n...\n",
        function (err) {
          if (err) {
            throw err;
            reject(-1);
          }
          console.log("File is created successfully.");
        }
      );
    }

    if (data.lang == "ita") {
      fs.writeFile(
        config.get("tmp_location") + name_file + ".md",
        "--- \n name: " +
          data.name +
          "\n surname: " +
          data.surname +
          "\n day: " +
          data.day +
          "/" +
          data.month +
          "/" +
          data.year +
          "\n street: " +
          data.street +
          "\n cash: " +
          data.cash +
          "\n...\n",
        function (err) {
          if (err) {
            reject(-1);
            throw err;
          }
          console.log("File is created successfully.");
        }
      );
    }

    //Creo il file md completo necessario
    var w = fs.createWriteStream(
      config.get("tmp_location") + name_file + ".md",
      { flags: "a" }
    );

    var r = fs.createReadStream(
      config.get("template_location") +
        config.get("template_name") +
        data.lang +
        ".md"
    );

    r.pipe(w);

    w.on("close", function () {
      console.log("done writing");
      resolve(1);
    });
  });
}

function deleteTmpFile(src) {
  fs.unlinkSync(src);
  console.log("Temporary file deleted");
}

function addTransaction(data2chain, userData) {
  data2chain.publickey = stringify(data2chain.publickey);

  var options = {
    url:
      config.get("currentNodeUrl") +
      config.get("port") +
      "/transaction/broadcast",
    method: "post",
    data: {
      userData: userData,
      signature: data2chain.signature,
      publicKey: data2chain.publickey,
    },
  };

  axios(options)
    .then(() => {
      console.log("Transaction added! \n");
    })
    .catch((err) => {
      console.log("Error adding transaction: " + err);
    });
}

function CreatePdf(data) {
  var name_file = randomstring.generate();
  var src = config.get("tmp_location") + name_file + ".md";
  var out = config.get("out_location") + name_file + ".pdf";
  markdownEditFile(data, name_file).then((v) => {
    console.log("Created file to convert!");
    Pandoc(src, out).then(() => {
      console.log("PDF created!");

      deleteTmpFile(src);
      //data to be inserted in blockchain
      if (config.get("digital_signature_active") == "yes") {
        var data2chain = DigitalSign(out);
        var userData = { name: data.name, surname: data.surname };
        addTransaction(data2chain, userData);
      }
      emailSender(out, data);
      console.log("Started to send email to:" + data.email);
    });
  });
}

exports.CreatePdf = CreatePdf;
