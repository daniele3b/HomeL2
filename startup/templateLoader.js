fs = require("fs");
const config = require("config");
const util = require("util");
const { emailSender } = require("./emailSender");
const exec = util.promisify(require("child_process").exec);
const path = require("path");
const replace = require("replace-in-file");

async function PandocDocx2Md(src, out) {
  try {
    const { stdout, stderr } = await exec("pandoc " + src + " -o " + out);
    console.log("stdout:", stdout);
    console.log("stderr:", stderr);
  } catch {
    (err) => {
      console.error(err);
    };
  }
}

function RemoveEscapeChar(file) {
  const options = {
    files: file,
    from: /\\/g,
    to: "",
    countMatches: true,
  };

  try {
    const results = replace.sync(options);
    console.log("Replacement results:", results);
  } catch (error) {
    console.error("Error occurred:", error);
  }
}

function GenerateTemplate() {
  const moveFrom = config.get("models_location");
  var moveTo = config.get("template_location_output");

  // Make an async function that gets executed immediately
  (async () => {
    // Our starting point
    try {
      // Get the files as an array
      const files = await fs.promises.readdir(moveFrom);

      // Loop them all with the new for...of
      for (const file of files) {
        // Get the full paths
        const fromPath = path.join(moveFrom, file);
        var toPath = path.join(moveTo, file);

        // Stat the file to see if we have a file or dir
        const stat = await fs.promises.stat(fromPath);

        if (stat.isFile()) console.log("'%s' is a file.", fromPath);
        else if (stat.isDirectory())
          console.log("'%s' is a directory.", fromPath);

        toPath = toPath.replace(".docx", ".md");
        console.log("'%s' is a file.", toPath);

        // Converting into .md
        await PandocDocx2Md(fromPath, toPath);
        await RemoveEscapeChar(toPath);

        // Log because we're crazy
        console.log("Converted '%s'->'%s'", fromPath, toPath);
      } // End for...of
    } catch (e) {
      // Catch anything bad that happens
      console.error("We've thrown! Whoops!", e);
    }
  })(); // Wrap in parenthesis and call now
}

exports.GenerateTemplate = GenerateTemplate;
