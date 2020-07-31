const { receiveInfo } = require("./amqp/consumer.js");
const { GenerateTemplate } = require("./startup/templateLoader");
const { KeyGenerator } = require("./helper/keyGenerator");

const express = require('express')
const app = express()
const config = require('config')

const port = config.get('port')

if(config.get('blockChainActive') == 'yes'){
    
    require('./startup/routes')(app)

    app.listen(port, function(){
        console.log("Listening on port "+port+"...")
    })
}

GenerateTemplate();

receiveInfo();
