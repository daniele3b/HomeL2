fs = require("fs");

function deletePdf(src) {
  fs.unlinkSync(src);
  console.log("Pdf deleted!");
}

exports.deletePdf = deletePdf;
