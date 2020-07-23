const amqp = require("amqplib/callback_api");
const config = require("config");
const { CreatePdf } = require("../helper/markdownEdit.js");

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

              const info = JSON.parse(msg.content);
              console.log(info);

              CreatePdf({
                name: info.name,
                surname: info.surname,
                email: info.email,
                birthday_day: info.birthday_day,
                birthday_month: info.birthday_month,
                birthday_year: info.birthday_year,
                day: info.day,
                month: info.month,
                year: info.year,
                street: info.street,
                city: info.city,
                cap: info.cap,
                to: info.to,
                lang: "eng",
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
