const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
    host: "smtp.libero.it",
    port: 465,
    secure: true, 
    auth: {
      user: "", 
      pass: ""
    }
});

exports.transporter = transporter