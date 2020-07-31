const { receiveInfo } = require("./amqp/consumer.js");
const { GenerateTemplate } = require("./startup/templateLoader");
const { KeyGenerator } = require("./helper/keyGenerator");

GenerateTemplate();

receiveInfo();
