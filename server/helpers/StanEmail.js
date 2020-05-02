const nodemailer = require("nodemailer");

export class StanEmail {
  constructor(height, width) {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.STAN_EMAIL,
        pass: process.env.STAN_EMAIL_PASSWORD
      }
    });
  }

  sendSignupMail(recipientEmail) {
    const mailOptions = {
      from: process.env.STAN_EMAIL,
      to: recipientEmail,
      subject: "Welcome to stan",
      text: "That was easy!"
    };

    this.transporter.sendMail(mailOptions, function(error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
  }
}
