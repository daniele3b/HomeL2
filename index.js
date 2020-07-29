const { receiveInfo } = require("./amqp/consumer.js");
const { GenerateTemplate } = require("./startup/templateLoader");
GenerateTemplate();

receiveInfo();

//receiveInfo();
//Inviare email di prova (mancano le credenziali)
//const {emailSender} = require('./helper/emailSender')
//emailSender()
