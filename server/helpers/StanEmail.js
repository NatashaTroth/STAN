const nodemailer = require("nodemailer");

export default class StanEmail {
  constructor() {
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
    console.log("SENDING SIGNUP MAIL");

    const subject = "Welcome to stan!";
    const h1 = `Welcome to stan`;
    const text = `so cool that you joined!`;

    this.sendMail(recipientEmail, subject, text, h1);
  }

  sendOneDayReminderMail(recipientEmail, exams) {
    console.log("SENDING ONE DAY REMINDER MAIL");
    let examWord = "exam";
    if (exams.length > 1) examWord = "exams";
    const subject = `${examWord} tomorrow`;
    const h1 = `Reminder that you have ${exams.length} ${examWord} tomorrow`;
    const text = `<p>stan wanted to remind you that you have the following ${examWord} tomorrow, which you haven't finished learning for yet:</p>
                  <ul>${this.createExamsListString(exams)}</ul>

                  <p>Please don't forget to learn, try to find the time today. Good luck!</p>

                 
    `;

    this.sendMail(recipientEmail, subject, text, h1);
  }

  sendThreeDayReminderMail(recipientEmail, exams) {
    console.log("SENDING THREE DAY REMINDER MAIL");
    let examWord = "exam";
    if (exams.length > 1) examWord = "exams";
    const subject = `${exams.length} ${examWord} in three days`;
    const h1 = `Reminder that you have ${exams.length} ${examWord} in three days`;
    const text = `<p>stan wanted to remind you that you have the following ${examWord} in three days time, which you haven't finished learning for yet:</p>
                  <ul>${this.createExamsListString(exams)}</ul>

                  <p>Please don't forget to learn, you still have time. Good luck!</p>
                  
                 
    `;

    this.sendMail(recipientEmail, subject, text, h1);
  }

  createExamsListString(exams) {
    let examsListString = "";
    exams.forEach(exam => {
      examsListString += `<li>${exam}</li>`;
    });
    return examsListString;
  }

  sendMail(to, subject, text, h1) {
    console.log("SENDING MAIL");
    const html = `<h1 style="color:#00729e">${h1}</h1>${text}<p>stan<img style="width: 90px" src="cid:unique@stan.com"/></p>`;

    console.log(__dirname + "/images/emailStan.png");
    const mailOptions = {
      from: process.env.STAN_EMAIL,
      to,
      subject,
      html,
      attachments: [
        {
          filename: "stan.png",
          path: __dirname + "/images/emailStan.png",
          cid: "unique@stan.com" //same cid value as in the html img src
        }
      ]
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
