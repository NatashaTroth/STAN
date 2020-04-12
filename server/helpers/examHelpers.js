import {
  verifyRegexSubject,
  verifyRegexPageAmount,
  verifyRegexPageTime,
  verifyRegexPageRepeat,
  verifyRegexCurrentPage,
  verifyRegexPageNotes
} from "../helpers/verifyUserInput";
import { AuthenticationError, ApolloError } from "apollo-server";
import { Exam } from "../models";
import { numberOfPagesForChunk } from "../helpers/chunks";
import { roundToTwoDecimals } from "../helpers/generalHelpers";
import {
  datesTimingIsValid,
  startDateIsActive,
  isTheSameDay,
  getNumberOfDays
} from "../helpers/dates";

export function prepareExamInputData(args, userId) {
  args.examDate = new Date(args.examDate);
  if (!args.startDate || args.startDate.length <= 0) {
    args.startDate = new Date();
  }
  args.timesRepeat = args.timesRepeat || 1;
  args.startPage = args.startPage || 0;
  args.currentPage = args.startPage;
  args.completed = args.completed || false;
  args.userId = userId;
  args.color = generateSubjectColor(args);

  return { ...args };
}

export function verifyExamInput(args) {
  //regex
  verifyNewExamInputFormat(args);

  if (isTheSameDay(args.startDate, args.examDate)) {
    throw new ApolloError(
      "Careful! You shouldn't start learning on the same day as the test. Start date should be at least 1 day before the test."
    );
  }

  if (!datesTimingIsValid(args.startDate, args.examDate))
    throw new ApolloError(
      "Dates cannot be in the past and start learning date must be before exam date."
    );

  if (args.startPage && args.startPage > args.numberPages)
    throw new ApolloError("Start page cannot higher than the number of pages.");
}

export async function handleCurrentPageInput(page, examId, userId) {
  const exam = await Exam.findOne({
    _id: examId,
    userId: userId
  });
  if (!exam) throw new ApolloError("There is no exam with that id.");
  if (page < exam.startPage)
    throw new ApolloError(
      "The entered current page is lower than the start page for this exam."
    );
  if (page > exam.numberPages * exam.timesRepeat)
    throw new ApolloError(
      "The entered current page is higher than the number of pages for this exam."
    );

  return exam;
}

export async function fetchTodaysChunks(userId) {
  const currentExams = await fetchCurrentExams(userId);
  return getTodaysChunks(currentExams);
}

export async function fetchCalendarChunks(userId) {
  const exams = await Exam.find({
    userId: userId,
    completed: false
  }).sort({ subject: "asc" });
  // const currentExams = await fetchCurrentExams(userId);
  return getCalendarChunks(exams);
}

async function fetchCurrentExams(userId) {
  const exams = await Exam.find({
    userId: userId,
    completed: false
  }).sort({ examDate: "asc" });
  const currentExams = exams.filter(exam => {
    return startDateIsActive(new Date(exam.startDate));
  });
  return currentExams;
}

function getTodaysChunks(currentExams) {
  return currentExams.map(exam => {
    const daysLeft = getNumberOfDays(new Date(), exam.examDate);
    //but should never come to this - but to avoid Infinity error
    if (daysLeft <= 0)
      throw new ApolloError(
        "Start date and exam date were the same for " + exam.subject + "."
      );
    if (exam.currentPage > exam.numberPages * exam.timesRepeat)
      throw new ApolloError(
        "The current page is higher than the number of pages for this exam."
      );
    const numberPagesToday = numberOfPagesForChunk({
      numberOfPages: exam.numberPages,
      currentPage: exam.currentPage,
      daysLeft,
      repeat: exam.timesRepeat
    });

    const duration =
      exam.timePerPage > 0 ? exam.timePerPage * numberPagesToday : null;
    return {
      exam,
      numberPagesToday,
      duration,
      daysLeft,
      totalNumberDays: getNumberOfDays(exam.startDate, exam.examDate),
      numberPagesWithRepeat: exam.numberPages * exam.timesRepeat,
      notEnoughTime: false //TODO: IMPLEMENT
    };
  });
}

function getCalendarChunks(exams) {
  //divide by days left
  // const headers = new Map();
  // header.set("Authorization", "test");
  const chunks = [];
  // console.log(JSON.stringify(exams));

  for (let i = 0; i < exams.length; i++) {
    const exam = exams[i];

    //TODO - BETWEEN STARTDATE OR TODAY
    let dayToStartCounting = exam.startDate;
    if (startDateIsActive(exam.startDate)) dayToStartCounting = new Date();
    const daysLeft = getNumberOfDays(dayToStartCounting, exam.examDate);

    const numberPagesLeftTotal =
      exam.numberPages * exam.timesRepeat - exam.currentPage + 1;
    const numberPagesPerDay = Math.ceil(numberPagesLeftTotal / daysLeft);

    chunks.push({
      subject: exam.subject,
      start: exam.startDate,
      end: exam.examDate,
      details: {
        examDate: exam.examDate,
        currentPage: exam.currentPage,
        numberPagesLeftTotal,
        numberPagesPerDay,
        durationTotal: numberPagesLeftTotal * exam.timePerPage,
        durationPerDay: Math.ceil(numberPagesPerDay * exam.timePerPage)
      },
      color: exam.color
    });
  }
  return chunks;
}

//TODO: SAVE IN DB - DO IN ADD EXAM
function generateSubjectColor(exam) {
  const hexChars = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "A", "B", "C", "D", "E", "F"];
  const colorNumbers = [];
  colorNumbers.push(
    Math.ceil(exam.subject.length * (Math.random() + 1)) % hexChars.length
  );
  colorNumbers.push(
    (exam.examDate.getDay() + exam.examDate.getMonth()) % hexChars.length
  );
  colorNumbers.push(
    (exam.startDate.getDay() + exam.startDate.getMonth()) % hexChars.length
  );
  colorNumbers.push((exam.numberPages * exam.timesRepeat) % hexChars.length);
  colorNumbers.push(exam.timePerPage % hexChars.length);
  colorNumbers.push(
    (colorNumbers[0] +
      colorNumbers[1] +
      colorNumbers[2] +
      colorNumbers[3] +
      colorNumbers[4]) %
      hexChars.length
  );

  let color = "#";

  colorNumbers.forEach(colorNumber => {
    color += hexChars[colorNumber].toString();
  });
  return color;
}

function verifyNewExamInputFormat(args) {
  verifySubjectFormat(args.subject);
  verifyNumberPagesFormat(args.numberPages);
  verifyTimePerPageFormat(args.timePerPage);
  verifyTimesRepeatFormat(args.timesRepeat);
  verifyStartPageFormat(args.startPage);
  verifyNotesFormat(args.notes);
}

function verifySubjectFormat(subject) {
  if (!verifyRegexSubject(subject))
    throw new AuthenticationError(
      "Subject input has the wrong format. It cannot be empty. Max length 50 characters."
    );
}

function verifyNumberPagesFormat(numberPages) {
  if (!verifyRegexPageAmount(numberPages.toString()))
    throw new AuthenticationError(
      "Number of pages input has the wrong format. It must be a positive number and cannot be empty. Max length 10000 characters."
    );
}

function verifyTimePerPageFormat(timePerPage) {
  if (!verifyRegexPageTime(timePerPage.toString()) || timePerPage <= 0)
    throw new AuthenticationError(
      "Time per page input has the wrong format. It must be a positive number and cannot be empty. Max length 600 characters."
    );
}

function verifyTimesRepeatFormat(timesRepeat) {
  if (timesRepeat != null && !verifyRegexPageRepeat(timesRepeat.toString()))
    throw new AuthenticationError(
      "Times to repeat input has the wrong format. It must be a positive number.  Max length 1000 characters."
    );
}

function verifyStartPageFormat(currentPage) {
  if (currentPage != null && !verifyRegexCurrentPage(currentPage.toString()))
    throw new AuthenticationError(
      "Start page input has the wrong format. It must ve a positive number.  Max length 10000 characters."
    );
}

function verifyNotesFormat(notes) {
  if (notes != null && !verifyRegexPageNotes(notes))
    throw new AuthenticationError(
      "Notes input has the wrong format. It cannot exceed 100000000 characters."
    );
}
