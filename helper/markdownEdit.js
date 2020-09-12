fs = require("fs");
const config = require("config");
const util = require("util");
const { emailSender } = require("./emailSender");
const exec = util.promisify(require("child_process").exec);
const { DigitalSign } = require("../helper/digitalSignature");
const { digitalSignatureRSA } = require("../helper/digitalSignatureRSA");
const axios = require("axios");
const {
  headerTemplateWriterT4,
  headerTemplateWriterT5,
  headerTemplateWriterT6,
  headerTemplateWriterT7,
} = require("./headerTemplateCompiler");
var randomstring = require("randomstring");

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

function writingCompletedMd(name_file, data) {
  return new Promise(function (resolve, reject) {
    var w = fs.createWriteStream(
      config.get("tmp_location") + name_file + ".md",
      {
        flags: "a",
      }
    );

    var r = fs.createReadStream(
      config.get("template_location") +
        config.get("template_name") +
        data.lang +
        data.template_id +
        ".md"
    );

    w.on("error", function (err) {
      done(err);
    });

    w.on("close", function () {
      console.log("done writing");
    });
    r.pipe(w);
    resolve(1);
  });
}

function markdownEditFile(data, name_file) {
  return new Promise(async function (resolve, reject) {
    if (data.lang == "eng") {
      if (data.template_id == "T4") {
        fs.writeFile(
          config.get("tmp_location") + name_file + ".md",
          headerTemplateWriterT4(data),
          function (err) {
            if (err) {
              throw err;
              reject(-1);
            }
            console.log("File is created successfully.");
          }
        );
      } else if (data.template_id == "T5") {
        fs.writeFile(
          config.get("tmp_location") + name_file + ".md",
          headerTemplateWriterT5(data),
          function (err) {
            if (err) {
              throw err;
              reject(-1);
            }
            console.log("File is created successfully.");
          }
        );
      } else if (data.template_id == "T6") {
        fs.writeFile(
          config.get("tmp_location") + name_file + ".md",
          headerTemplateWriterT6(data),
          function (err) {
            if (err) {
              throw err;
              reject(-1);
            }
            console.log("File is created successfully.");
          }
        );
      } else if (data.template_id == "T7") {
        fs.writeFile(
          config.get("tmp_location") + name_file + ".md",
          headerTemplateWriterT7(data),
          function (err) {
            if (err) {
              throw err;
              reject(-1);
            }
            console.log("File is created successfully.");
          }
        );
      }
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
    if (data.lang == "arb") {
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

    //complete the file
    await writingCompletedMd(name_file, data);
    resolve(1);
  });
}

function deleteTmpFile(src) {
  fs.unlinkSync(src);
  console.log("Temporary file deleted");
}

function addTransaction(data2chain, userData) {
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
  var name_file = randomstring.generate({ charset: "alphabetic" });
  var src = config.get("tmp_location") + name_file + ".md";
  var out = config.get("out_location") + name_file + ".pdf";
  markdownEditFile(data, name_file).then((v) => {
    console.log("Created file to convert!");
    Pandoc(src, out).then(() => {
      console.log("PDF created!");

      deleteTmpFile(src);
      //data to be inserted in blockchain
      if (config.get("digital_signature_active") == "yes") {
        var userData = {
          name: data.name,
          surname: data.surname,
          id: name_file,
        };

        if (config.get("digital_signature_alg") == "ECDSA") {
          var data2chain = DigitalSign(out);
          addTransaction(data2chain, userData);
        } else if (config.get("digital_signature_alg") == "RSA") {
          var data2chain = digitalSignatureRSA(out);
          addTransaction(data2chain, userData);
        }
      }
      emailSender(out, data, name_file);
      console.log("Started to send email to:" + data.email);
    });
  });
}

exports.CreatePdf = CreatePdf;
