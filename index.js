const { receiveInfo } = require("./amqp/consumer.js");
const { CreatePdf } = require("./helper/markdownEdit.js");

//receiveInfo();
//Inviare email di prova (mancano le credenziali)
//const {emailSender} = require('./helper/emailSender')
//emailSender()
CreatePdf({
  name: "Daniele",
  surname: "Bufalieri",
  day: "2",
  month: "12",
  year: "98",
  street: "via attilio palozza",
  cash: 500,
  lang: "eng",
});
