import {
  verifyRegexSubject,
  verifyRegexPageAmount,
  verifyRegexPageTime,
  verifyRegexPageRepeat,
  verifyRegexCurrentPage,
  verifyRegexPageNotes
} from "../helpers/verifyUserInput";
import { AuthenticationError, ApolloError } from "apollo-server";
import { Exam, TodaysChunkCache } from "../models";

// import { roundToTwoDecimals } from "../helpers/generalHelpers";
import {
  datesTimingIsValid,
  startDateIsActive,
  isTheSameDay,
  getNumberOfDays,
  startDateIsBeforeExamDate
} from "../helpers/dates";

export function numberOfPagesForChunk({
  numberOfPages,
  currentPage,
  daysLeft,
  repeat
}) {
  if (
    isNaN(numberOfPages) ||
    isNaN(currentPage) ||
    isNaN(daysLeft) ||
    isNaN(repeat)
  )
    throw new Error("Not all arguments for numberOfPagesForChunk are numbers.");
  let pagesLeft = numberOfPages * repeat - currentPage + 1;

  return Math.ceil(pagesLeft / daysLeft);
}

export async function fetchTodaysChunks(userId) {
  const currentExams = await fetchCurrentExams(userId);
  const chunks = calculateTodaysChunks(currentExams);
  // await TodaysChunkCache.insertMany(chunks).then(resp => console.log(resp));

  return chunks;
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

function calculateTodaysChunks(currentExams) {
  return currentExams.map(exam => {
    const daysLeft = getNumberOfDays(new Date(), exam.examDate);
    //but should never come to this - but to avoid Infinity error
    //TODO: REMOVE
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
    const chunk = {
      exam,
      numberPagesToday,
      duration,
      daysLeft,
      totalNumberDays: getNumberOfDays(exam.startDate, exam.examDate),
      numberPagesWithRepeat: exam.numberPages * exam.timesRepeat,
      notEnoughTime: false //TODO: IMPLEMENT
    };
    // addtodaysChunkToDatabase()
    return chunk;
  });
}

function getCalendarChunks(exams) {
  const chunks = [];

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
