import schedule from "node-schedule";

import { User, Exam } from "./../models";
import { getNumberOfDays, isTheSameDay, date1IsBeforeDate2 } from "./dates";
import StanEmail from "./StanEmail";
const stanEmail = new StanEmail();
import { deleteExamsTodaysCache } from "./exams/chunks";
import { deleteUsersData, deleteUser } from "./users/userHelpers";

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
    schedule.scheduleJob({ hour: 2, minute: 30 }, async () => {
      this.notifyUsersAboutExams();
      this.completePastExams();
      this.removeNoLongerNeededCache();
      this.notifyAndDeleteOldUsers();
    });

    // schedule.scheduleJob("*/1 * * * *", function() {
    //   console.log("THE SCHEDULER IS WORKING");
    // });
  }

  //TODO - SIGN UP MAIL, DELETE ACCOUNT MAIL, START LEARNING DATE MAILS

  async notifyUsersAboutExams() {
    //{ hour: 17, minute: 32 }
    // schedule.scheduleJob({ hour: 2, minute: 30 }, async () => {
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
        console.log(JSON.stringify(examsInOneDay));
        if (isTheSameDay(new Date(), exam.startDate))
          startDatesToday.push(exam.subject);
      });
      // if (examsInOneDay.length > 0)
      //   stanEmail.sendOneDayReminderMail(user.email, examsInOneDay);
      // if (examsInThreeDays.length > 0)
      //   stanEmail.sendThreeDayReminderMail(user.email, examsInThreeDays);
      if (
        examsInOneDay.length > 0 ||
        examsInThreeDays.length > 0 ||
        startDatesToday.length > 0
      )
        stanEmail.sendExamDateReminderMail(
          user.email,
          examsInOneDay,
          examsInThreeDays,
          startDatesToday,
          user.mascot
        );
    });
    // });
  }

  async completePastExams() {
    // schedule.scheduleJob({ hour: 22, minute: 31 }, async () => {
    console.log("SCHEDULED COMPLETING PAST EXAMS");
    const exams = await Exam.find({
      completed: false
    });
    console.log(exams);
    exams.forEach(async exam => {
      console.log(exam.subject);
      if (date1IsBeforeDate2(exam.examDate, new Date())) {
        await Exam.updateOne(
          { _id: exam._id },
          { completed: true, updatedAt: new Date() }
        );
        console.log("updating exam " + exam.subject);
        await deleteExamsTodaysCache(exam.userId, exam._id);
      }
    });
    // });
  }

  async removeNoLongerNeededCache() {
    console.log("REMOVING NO LONGER NEEDED CACHE");
    const exams = await Exam.find({
      completed: true
    });
    exams.forEach(async exam => {
      await deleteExamsTodaysCache(exam.userId, exam._id);
    });
  }

  async notifyAndDeleteOldUsers() {
    const users = await User.find();
    users.forEach(async user => {
      const daysSinceLastVisited = getNumberOfDays(
        user.lastVisited,
        new Date()
      );
      console.log("user: " + user.username);
      console.log("-------days since last visited: " + daysSinceLastVisited);

      if (daysSinceLastVisited === 365)
        stanEmail.sendExamDeleteAccountWarning(user.email, 1, user.mascot);
      else if (daysSinceLastVisited >= 366) {
        await deleteUsersData(user._id);
        await deleteUser(user._id);
        stanEmail.sendDeleteAccountMail(user.email, user.mascot);
      } else if (
        daysSinceLastVisited >= 336 &&
        user.sentOneMonthDeleteReminder === false
      ) {
        stanEmail.sendExamDeleteAccountWarning(
          user.email,
          366 - daysSinceLastVisited,
          user.mascot
        );
        await User.updateOne(
          { _id: user._id },
          { sentOneMonthDeleteReminder: true, updatedAt: new Date() }
        );
      }
    });
  }
}
