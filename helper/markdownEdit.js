fs = require("fs");
const config = require("config");
const util = require("util");
const { emailSender } = require("./emailSender");
const exec = util.promisify(require("child_process").exec);

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

function markdownEditFile(data) {
  return new Promise(function (resolve, reject) {
    if (data.lang == "eng") {
      fs.writeFile(
        config.get("tmp_location") + data.name + data.surname + ".md",
        "--- \n name: " +
          data.name +
          "\n surname: " +
          data.surname +
          "\n birthday: " +
          data.birthday_month +
          "/" +
          data.birthday_day +
          "/" +
          data.birthday_year +
          "\n day: " +
          data.month +
          "/" +
          data.day +
          "/" +
          data.year +
          "\n street: " +
          data.street +
          "\n city: " +
          data.city +
          "\n cap: " +
          data.cap +
          "\n to: " +
          data.to +
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
        config.get("tmp_location") + data.name + data.surname + ".md",
        "--- \n name: " +
          data.name +
          "\n surname: " +
          data.surname +
          "\n birthday: " +
          data.birthday_day +
          "/" +
          data.birthday_month +
          "/" +
          data.birthday_year +
          "\n day: " +
          data.day +
          "/" +
          data.month +
          "/" +
          data.year +
          "\n street: " +
          data.street +
          "\n city: " +
          data.city +
          "\n cap: " +
          data.cap +
          "\n to: " +
          data.to +
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
      config.get("tmp_location") + data.name + data.surname + ".md",
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

function CreatePdf(data) {
  var src = config.get("tmp_location") + data.name + data.surname + ".md";
  var out = config.get("out_location") + data.name + data.surname + ".pdf";
  markdownEditFile(data).then((v) => {
    console.log("Created file to convert!");
    Pandoc(src, out).then(() => {
      console.log("PDF created!");
      deleteTmpFile(src);
      emailSender(out, data);
      console.log("Started to send email to:" + data.email);
    });
  });
}

exports.CreatePdf = CreatePdf;
