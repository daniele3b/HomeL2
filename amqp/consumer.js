const amqp = require("amqplib/callback_api");
const config = require("config");
const { CreatePdf } = require("../helper/markdownEdit.js");
const { decryptData } = require("../helper/keyGenerator");
const { decipherSym } = require("../helper/decipherSym");
require("dotenv").config();

function receiveInfo() {
  amqp.connect(config.get("amqp_server"), function (error0, connection) {
    if (error0) {
      throw error0;
    }
    connection.createChannel(function (error1, channel) {
      if (error1) {
        throw error1;
      }
      const exchange = config.get("amqp_exchange");

      channel.assertExchange(exchange, "direct", {
        durable: false,
      });

      channel.assertQueue(
        "",
        {
          exclusive: true,
        },
        function (error2, q) {
          if (error2) {
            throw error2;
          }
          console.log(
            "[Service " +
              config.get("amqp_binding_key") +
              "] Waiting for info..."
          );

          channel.bindQueue(q.queue, exchange, config.get("amqp_binding_key"));

          channel.consume(
            q.queue,
            function (msg) {
              console.log(
                "[Service " +
                  config.get("amqp_binding_key") +
                  "] Received info!"
              );

              // Receiving info
              let info = JSON.parse(msg.content);

              // If criptography is active
              if (config.get("security_active") == "yes") {
                // If public key criptography (asymmetric) is active
                if (process.env.ASYM_ENC_ACTIVE == "yes") {
                  console.log("[ASYMETTRIC] INFO CRIPTATE RICEVUTE");
                  console.log(info);

                  // Decrypting info
                  info = decryptData(info);
                  console.log("[ASYMETTRIC] INFO DECRIPTATE RICEVUTE");
                  console.log(info);

                  // If symmetric criptography is active
                } else {
                  console.log("[SYMETTRIC] INFO CRIPTATE RICEVUTE");
                  console.info(info);

                  // Decrypting info
                  info = decipherSym(info);
                  console.log("[SYMETTRIC] INFO DECRIPTATE RICEVUTE");
                  console.log(info);
                }
              }

              // If criptography is NOT active
              else console.log(info);

              CreatePdf({
                name: info.name,
                surname: info.surname,
                day: info.day,
                month: info.month,
                year: info.year,
                street: info.street,
                cash: info.cash,
                email: info.email,
                lang: info.lang,
                template_id: info.template_id
              });
            },
            {
              noAck: true,
            }
          );
        }
      );
    });
  });
}

exports.receiveInfo = receiveInfo;
