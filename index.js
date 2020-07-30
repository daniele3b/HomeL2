const { receiveInfo } = require("./amqp/consumer.js");
const { GenerateTemplate } = require("./startup/templateLoader");

GenerateTemplate();

receiveInfo();
