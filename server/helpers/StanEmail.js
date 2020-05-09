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

  sendExamDateReminderMail(
    email,
    examsInOneDay,
    examsInThreeDays,
    startDatesToday
  ) {
    console.log("SENDING THREE DAY REMINDER MAIL");
    let totalExamsLength = examsInOneDay.length + examsInThreeDays.length;
    let examWord = "Exam";
    if (totalExamsLength > 1) examWord = "Exams";
    if (totalExamsLength === 1) totalExamsLength = "";
    let examsListString = "";
    if (examsInOneDay.length > 0) {
      examsListString += `<b>${examsInOneDay.length} ${
        examsInOneDay.length > 1 ? "exams" : "exam"
      } tomorrow:</b><ul>${this.createExamsListString(examsInOneDay)}</ul>`;
    }
    if (examsInThreeDays.length > 0) {
      examsListString += `<b>${examsInThreeDays.length} ${
        examsInThreeDays.length > 1 ? "exams" : "exam"
      } in three days' time:</b><ul>${this.createExamsListString(
        examsInThreeDays
      )}</ul>`;
    }

    const subject = `${examWord} coming up!`;
    const h1 = `Reminder that you have the following ${totalExamsLength} ${examWord.toLowerCase()} coming up`;
    const text = `<p>stan wanted to remind you that you have the following ${examWord.toLowerCase()} in three days time, which you haven't finished learning for yet:</p>${examsListString}<p><b>You also need to start learning for the following ${
      startDatesToday.length > 1 ? "exams" : "exam"
    } today:</b></p>
    <ul>${this.createExamsListString(
      startDatesToday
    )}</ul> <br><p>Please don't forget to learn, you still have time. Good luck!</p><br>
    `;

    this.sendMail(email, subject, text, h1);
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
    //TODO (IF TIME): send correct mascot - 0,1 or 2
    const html = `<h1 style="color:#00729e">${h1}</h1>${text}<p><img style="width: 220px" src="cid:unique@stan.com"/></p>`;

    console.log(__dirname + "/images/emailStan.svg");
    const mailOptions = {
      from: process.env.STAN_EMAIL,
      to,
      subject,
      html,
      attachments: [
        {
          filename: "stan.svg",
          path: __dirname + "/images/emailStan.svg",
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
