function headerTemplateWriterENGT4(data) {
  const toReturn =
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
    "\n...\n";
  return toReturn;
}

function headerTemplateWriterENGT5(data) {
  const toReturn =
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
    "\n...\n";
  return toReturn;
}

function headerTemplateWriterENGT6(data) {
  const toReturn =
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
    "\n...\n";
  return toReturn;
}

function headerTemplateWriterENGT7(data) {
  const toReturn =
    "--- \n day: " +
    data.month +
    "/" +
    data.day +
    "/" +
    data.year +
    "\n street: " +
    data.street +
    "\n cash: " +
    data.cash +
    "\n...\n";
  return toReturn;
}

exports.headerTemplateWriterENGT4 = headerTemplateWriterENGT4;
exports.headerTemplateWriterENGT5 = headerTemplateWriterENGT5;
exports.headerTemplateWriterENGT6 = headerTemplateWriterENGT6;
exports.headerTemplateWriterENGT7 = headerTemplateWriterENGT7;
