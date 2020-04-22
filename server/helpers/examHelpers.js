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

// import { roundToTwoDecimals } from "../helpers/generalHelpers";
import {
  datesTimingIsValid,
  // startDateIsActive,
  isTheSameDay,
  getNumberOfDays,
  startDateIsBeforeExamDate
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
  args.totalNumberDays = getNumberOfDays(args.startDate, args.examDate);
  args.updatedAt = new Date();

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

  if (args.startPage && args.startPage > args.numberPages)
    throw new ApolloError("Start page cannot higher than the number of pages.");
}

export function verifyAddExamDates(startDate, examDate) {
  if (!datesTimingIsValid(startDate, examDate))
    throw new ApolloError(
      "Dates cannot be in the past and start learning date must be before exam date."
    );
}

export function verifyUpdateExamDates(startDate, examDate, oldStartDate) {
  if (isTheSameDay(startDate, oldStartDate)) {
    if (!startDateIsBeforeExamDate(startDate, examDate))
      throw new ApolloError("Start learning date must be before exam date.");
  } else verifyAddExamDates(startDate, examDate);
}

export async function handleUpdateExamInput(args, userId) {
  const exam = await Exam.findOne({
    _id: args.id,
    userId: userId
  });
  if (!exam)
    throw new ApolloError(
      "No exam exists with this exam id: " + args.id + " for this user."
    );
  //TODO: CHANGE NOT GOOD - MIGHT NOT BE START DATE, AND ORIGINAL STARTDATE MIGHT BE IN THE PAST
  // console.log("HERE");
  // console.log(args.startDate + " " + args.examDate);
  verifyExamInput(args, userId);
  verifyUpdateExamDates(args.startDate, args.examDate, exam.startDate);
  return prepareExamInputData({ ...args }, userId);
}

export async function handleCurrentPageInput(page, examId, userId) {
  const exam = await Exam.findOne({
    _id: examId,
    userId: userId
  });
  if (!exam)
    throw new ApolloError(
      "There is no exam with the id: " + examId + " for that user."
    );
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
