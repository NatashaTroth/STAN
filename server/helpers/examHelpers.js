import {
  verifyRegexSubject,
  verifyRegexExamDate,
  verifyRegexStudyStartDate,
  verifyRegexPageAmount,
  verifyRegexPageTime,
  verifyRegexPageRepeat,
  verifyRegexCurrentPage,
  verifyRegexPageNotes
} from "../helpers/verifyUserInput";
import { AuthenticationError, ApolloError } from "apollo-server";
import { Exam } from "../models";
import { numberOfPagesForChunk } from "../helpers/chunks";
import {
  datesTimingIsValid,
  startDateIsActive,
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

  return args;
}

export function verifyExamInput(args) {
  //regex
  // verifyUserInputFormat(args);
  verifyNewExamInputFormat(args);

  if (!datesTimingIsValid(args.startDate, args.examDate))
    throw new ApolloError(
      "Dates cannot be in the past and start learning date must be before exam date."
    );

  //TODO MOVE TO VERIFY USER INPUT
  if (args.timePerPage <= 0)
    throw new ApolloError("Time per page has to be higher than 0.");
}

export async function handleCurrentPageInput(page, examId, userId) {
  const exam = await Exam.findOne({
    _id: examId,
    userId: userId
  });
  if (!exam) throw new ApolloError("There is no exam with that id.");
  if (page > exam.numberPages * exam.timesRepeat)
    throw new ApolloError(
      "The entered current page is higher than the number of pages for this exam."
    );
  return exam;
}

export async function fetchTodaysChunks(userId) {
  const currentExams = await fetchCurrentExams(userId);
  return fetchChunks(currentExams);
}

async function fetchCurrentExams(userId) {
  const exams = await Exam.find({
    userId: userId,
    completed: false
  });
  const currentExams = exams.filter(exam => {
    return startDateIsActive(new Date(exam.startDate));
  });
  return currentExams;
}

function fetchChunks(currentExams) {
  return currentExams.map(exam => {
    const daysLeft = getNumberOfDays(new Date(), exam.examDate);
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

function verifyNewExamInputFormat(args) {
  verifySubjectFormat(args.subject);
  verifyExamDateFormat(args.examDate);
  verifyStartDateFormat(args.startDate);
  verifyNumberPagesFormat(args.numberPages);
  verifyTimePerPageFormat(args.timePerPage);
  verifyTimesRepeatFormat(args.timesRepeat);
  verifyCurrentPageFormat(args.currentPage);
  verifyNotesFormat(args.notes);
}

function verifySubjectFormat(subject) {
  if (!verifyRegexSubject(subject))
    throw new AuthenticationError("Subject input has the wrong format.");
}

function verifyExamDateFormat(examDate) {
  let examOnlyDate = new Date(examDate).toLocaleDateString();
  if (!verifyRegexExamDate(examOnlyDate))
    throw new AuthenticationError("Exam date input has the wrong format.");
}

function verifyStartDateFormat(startDate) {
  let startOnlyDate = "";
  if (startDate && startDate.length > 0)
    startOnlyDate = new Date(startDate).toLocaleDateString();

  if (startDate != null && !verifyRegexStudyStartDate(startOnlyDate))
    throw new AuthenticationError(
      "Study start date input has the wrong format."
    );
}

function verifyNumberPagesFormat(numberPages) {
  if (!verifyRegexPageAmount(numberPages.toString()))
    throw new AuthenticationError(
      "Number of pages input has the wrong format."
    );
}

function verifyTimePerPageFormat(timePerPage) {
  if (!verifyRegexPageTime(timePerPage.toString()))
    throw new AuthenticationError("Time per page input has the wrong format.");
}

function verifyTimesRepeatFormat(timesRepeat) {
  if (timesRepeat != null && !verifyRegexPageRepeat(timesRepeat.toString()))
    throw new AuthenticationError(
      "Times to repeat input has the wrong format."
    );
}

//????? or startpage??
function verifyCurrentPageFormat(currentPage) {
  if (currentPage != null && !verifyRegexCurrentPage(currentPage.toString()))
    throw new AuthenticationError("Current page input has the wrong format.");
}

function verifyNotesFormat(notes) {
  if (notes != null && !verifyRegexPageNotes(notes))
    throw new AuthenticationError("Notes input has the wrong format.");
}

// function verifyUserInputFormat({
//   subject,
//   examDate,
//   startDate,
//   numberPages,
//   timePerPage,
//   timesRepeat,
//   currentPage,
//   notes
//   // pdfLink,
// }) {
//   // let examOnlyDate = new Date(examDate).toLocaleDateString();
//   // let startOnlyDate = "";
//   // if (startDate && startDate.length > 0)
//   //   startOnlyDate = new Date(startDate).toLocaleDateString();

//   //TODO: MAKE SURE CHECKED EVERYTHING THAT CAN BE NULL
//   // if (typeof subject !== "undefined" && !verifyRegexSubject(subject))
//   //   throw new AuthenticationError("Subject input has the wrong format.");

//   // if (typeof examDate !== "undefined" && !verifyRegexExamDate(examOnlyDate))
//   //   throw new AuthenticationError("Exam date input has the wrong format.");

//   // if (
//   //   typeof startDate !== "undefined" &&
//   //   startDate != null &&
//   //   !verifyRegexStudyStartDate(startOnlyDate)
//   // )
//   //   throw new AuthenticationError(
//   //     "Study start date input has the wrong format."
//   //   );

//   // if (
//   //   typeof numberPages !== "undefined" &&
//   //   !verifyRegexPageAmount(numberPages.toString())
//   // )
//   //   throw new AuthenticationError(
//   //     "Number of pages input has the wrong format."
//   //   );

//   // if (
//   //   typeof timePerPage !== "undefined" &&
//   //   timePerPage != null &&
//   //   !verifyRegexPageTime(timePerPage.toString())
//   // )
//   //   throw new AuthenticationError("Time per page input has the wrong format.");

//   // if (
//   //   typeof timesRepeat !== "undefined" &&
//   //   timesRepeat != null &&
//   //   !verifyRegexPageRepeat(timesRepeat.toString())
//   // )
//   //   throw new AuthenticationError(
//   //     "Times to repeat input has the wrong format."
//   //   );

//   // if (
//   //   typeof currentPage !== "undefined" &&
//   //   currentPage != null &&
//   //   !verifyRegexCurrentPage(currentPage.toString())
//   // )
//   //   throw new AuthenticationError("Current page input has the wrong format.");

//   // if (
//   //   typeof notes !== "undefined" &&
//   //   notes != null &&
//   //   !verifyRegexPageNotes(notes)
//   // )
//   //   throw new AuthenticationError("Notes input has the wrong format.");
// }
