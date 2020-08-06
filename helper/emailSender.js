const { transporter } = require("../startup/emailSender");
const { deletePdf } = require("../helper/pdfDestroyer");

async function emailSender(pdf, data, idPdf) {
  let info = await transporter.sendMail({
    from: '"HomeLess Project" <progetto-diana@libero.it>',
    to: data.email,
    subject: "that's your document! ID:" + idPdf,
    html: "Hi that's your document!",

    attachments: [
      {
        path: pdf,
      },
    ],
  });
  deletePdf(pdf);
}

exports.emailSender = emailSender;
