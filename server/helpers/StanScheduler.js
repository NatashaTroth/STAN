import schedule from "node-schedule";

import { User, Exam } from "./../models";
import { getNumberOfDays, isTheSameDay } from "./dates";
import StanEmail from "./StanEmail";
const stanEmail = new StanEmail();

export default class StanScheduler {
  constructor() {
    this.init();
  }

  init() {
    // var j = schedule.scheduleJob("47 * * * *", function() {
    //   console.log("The answer to life, the universe, and everything!");
    // });
    //     const rule = new schedule.RecurrenceRule();
    // // rule.dayOfWeek = [0, new schedule.Range(4, 6)];
    // rule.hour = 17;
    // rule.minute = 0;

    // const j = schedule.scheduleJob(rule, function(){
    //   console.log('Today is recognized by Rebecca Black!');
    // });
    this.notifyUsersAboutExams();

    // schedule.scheduleJob("*/1 * * * *", function() {
    //   console.log("THE SCHEDULER IS WORKING");
    // });
  }

  //TODO - SIGN UP MAIL, DELETE ACCOUNT MAIL, START LEARNING DATE MAILS

  async notifyUsersAboutExams() {
    //{ hour: 17, minute: 32 }
    schedule.scheduleJob({ hour: 23, minute: 16 }, async () => {
      //3 UTC (Greenwich), 4am Austrian time
      console.log("Sending Mails");

      //TODO: INDEX allowEmailNotifications

      const users = await User.find({ allowEmailNotifications: true });
      console.log(users.length + " no users authenticated");
      users.forEach(async user => {
        const examsInOneDay = [];
        const examsInThreeDays = [];
        const startDatesToday = [];
        const exams = await Exam.find({
          userId: user._id,
          completed: false
        }).sort({ subject: "asc" });
        exams.forEach(exam => {
          const numberOfDaysUntilExam = getNumberOfDays(
            new Date(),
            exam.examDate
          );
          console.log(numberOfDaysUntilExam);
          if (numberOfDaysUntilExam === 1) examsInOneDay.push(exam.subject);
          if (numberOfDaysUntilExam === 3) examsInThreeDays.push(exam.subject);
          if (isTheSameDay(new Date(), exam.startDate))
            startDatesToday.push(exam.subject);
        });
        // if (examsInOneDay.length > 0)
        //   stanEmail.sendOneDayReminderMail(user.email, examsInOneDay);
        // if (examsInThreeDays.length > 0)
        //   stanEmail.sendThreeDayReminderMail(user.email, examsInThreeDays);
        stanEmail.sendExamDateReminderMail(
          user.email,
          examsInOneDay,
          examsInThreeDays,
          startDatesToday
        );
      });
    });
  }
}
