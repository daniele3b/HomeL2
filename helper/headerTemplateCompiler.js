function headerTemplateWriterT4(data) {
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

function headerTemplateWriterT5(data) {
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

function headerTemplateWriterT6(data) {
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

function headerTemplateWriterT7(data) {
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

exports.headerTemplateWriterT4 = headerTemplateWriterT4;
exports.headerTemplateWriterT5 = headerTemplateWriterT5;
exports.headerTemplateWriterT6 = headerTemplateWriterT6;
exports.headerTemplateWriterT7 = headerTemplateWriterT7;
