const { transporter } = require("../startup/emailSender");

async function emailSender(pdf, data) {
  let info = transporter.sendMail({
    from: '"HomeLess Project" <progetto-diana@libero.it>',
    to: "mariocavaiola@libero.it",
    subject: "That's your document!",
    text: "Hi, that's your document!",
    html: "Hi, that's your document!",
    /*
        attachments: [
            {
             path: ''
            }
         ]*/
  });
}

exports.emailSender = emailSender;
