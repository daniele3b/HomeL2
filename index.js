const { receiveInfo } = require("./amqp/consumer.js");
const { GenerateTemplate } = require("./startup/templateLoader");
const { KeyGenerator } = require("./helper/keyGenerator");
KeyGenerator();
/*
GenerateTemplate();

receiveInfo();
*/
