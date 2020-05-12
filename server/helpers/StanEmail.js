const nodemailer = require("nodemailer");

export default class StanEmail {
  //TODO: singleton
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

  sendSignupMail(recipientEmail, mascot) {
    console.log("SENDING SIGNUP MAIL");

    const subject = "Welcome to stan!";
    const h1 = `Welcome to stan...`;
    const text = `<p>It's so nice to meet you! We hope you enjoy all the features that stan has to offer. Add you first exam directly from the dashboard, keep track of your upcoming exams in the calendar view. But most importantly, toggle between light and dark mode!</p><p>We hope stan can help you with your upcoming exams!</p><p>Good luck and happy learning!</p>`;

    this.sendMail(recipientEmail, subject, text, h1, mascot);
  }

  sendDeleteAccountMail(recipientEmail, mascot) {
    console.log("SENDING DELETE ACCOUNT MAIL");

    const subject = "Goodbye :(";
    const h1 = `Sorry to hear you are leaving...`;
    const text = `<p>We're sorry to hear that you have decided to stop using stan. Please remember, you are always welcome back! We have deleted all your data, so if you decide to visit again, be sure to create a new account. Until then, good luck, we wish you the best!</p>
    <p>If you were unhappy with stan or you have ideas for improvements, please send us an <a href="mailto:stan.studyplan@gmail.com">email</a> and tell us what we can do better to help other students.</p>`;

    this.sendMail(recipientEmail, subject, text, h1, mascot);
  }

  sendForgottenPasswordMail(recipientEmail, link) {
    console.log("SENDING FORGOTTEN PASSWORD MAIL");

    const subject = "Reset Password";
    const h1 = `Reset your password...`;
    const text = `<p>Don't worry, it's only human to forget things. Click <a href=" ${link}">here</a> to reset your password. This link is only valid for 10 minutes. If you run out of time, request another link on the forgotten password page.</p>`;

    this.sendMail(recipientEmail, subject, text, h1);
  }

  sendExamDateReminderMail(
    recipientEmail,
    examsInOneDay,
    examsInThreeDays,
    startDatesToday,
    mascot
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
    )}</ul> <br><p>Please don't forget to learn, you still have time. Good luck!</p>
    `;

    this.sendMail(recipientEmail, subject, text, h1, mascot);
  }

  createExamsListString(exams) {
    let examsListString = "";
    exams.forEach(exam => {
      examsListString += `<li>${exam}</li>`;
    });
    return examsListString;
  }

  sendMail(to, subject, text, h1, mascot = 0) {
    console.log("SENDING MAIL");

    let image = `${mascot}-emailStan.svg`;

    //TODO (IF TIME): send correct mascot - 0,1 or 2
    const html = `<h1 style="color:#00729e">${h1}</h1>${text}<br><p><img style="width: 220px" src="cid:unique@stan.com"/></p>`;

    console.log(`${__dirname}/images/${image}`);
    const mailOptions = {
      from: process.env.STAN_EMAIL,
      to,
      subject,
      html,
      attachments: [
        {
          filename: "stan.svg",
          path: `${__dirname}/images/${image}`,
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
