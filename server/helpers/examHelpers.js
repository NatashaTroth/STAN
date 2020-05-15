import {
  verifyRegexSubject,
  verifyRegexPageAmount,
  verifyRegexPageTime,
  verifyRegexPageRepeat,
  verifyRegexCurrentPage,
  verifyRegexPageNotes,
  verifyRegexUrlLink
} from "../helpers/verifyUserInput";
import { AuthenticationError, ApolloError } from "apollo-server";
import { Exam } from "../models";

import { escapeStringForHtml } from "../helpers/generalHelpers";
import {
  datesTimingIsValid,
  // startDateIsActive,
  isTheSameDay,
  getNumberOfDays,
  date1IsBeforeDate2
} from "../helpers/dates";
import validator from "validator";

export function prepareExamInputData(args, userId) {
  args.examDate = new Date(args.examDate);
  if (!args.startDate || args.startDate.length <= 0) {
    args.startDate = new Date();
  }
  args.timesRepeat = args.timesRepeat || 1;
  args.startPage = args.startPage || 1;
  args.currentPage = args.currentPage || args.startPage;
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
    throw new ApolloError("Start page cannot higher than the last page.");
}

export function verifyAddExamDates(startDate, examDate) {
  if (!datesTimingIsValid(startDate, examDate))
    throw new ApolloError(
      "Dates cannot be in the past and start learning date must be before exam date."
    );
}

export function verifyUpdateExamDates(startDate, examDate, oldStartDate) {
  if (isTheSameDay(startDate, oldStartDate)) {
    if (!date1IsBeforeDate2(startDate, examDate))
      throw new ApolloError("Start learning date must be before exam date.");
  } else verifyAddExamDates(startDate, examDate);
}

export async function handleUpdateExamInput(exam, args, userId) {
  //TODO: CHANGE NOT GOOD - MIGHT NOT BE START DATE, AND ORIGINAL STARTDATE MIGHT BE IN THE PAST
  // console.log("HERE");
  // console.log(args.startDate + " " + args.examDate);
  verifyExamInput(args, userId);
  verifyUpdateExamDates(args.startDate, args.examDate, exam.startDate);
  // learningIsComplete(args.currentPage, args.startPage, a);
  // args.completed = exam.completed;
  // if (!args.completed)
  //   args.completed = learningIsComplete(
  //     args.currentPage,
  //     args.startPage,
  //     args.numberPages,
  //     args.repeat
  //   );

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
  if (page > exam.numberPages * exam.timesRepeat + exam.startPage)
    throw new ApolloError(
      "The entered current page is higher than the number of pages for this exam."
    );

  // console.log("checking exam learning complete not chunk");
  exam.completed = learningIsComplete(
    page,
    exam.startPage,
    exam.numberPages,
    exam.timesRepeat
  );

  return exam;
}

//middle color
//fist light
function generateSubjectColor(exam) {
  const hexCharsFirstTwoDigits = ["A", "B", "C", "D", "E", "F"]; //(red)
  // const hexChars = [1, 2, 3, 4, 5, 6, 7, 8, 9, "A", "B", "C", "D", "E", "F"];
  const hexCharsSecondTwoDigits = [9, "A", "B", "C", "D", "E", "F"]; //(green)
  const hexCharsThirdTwoDigits = [9, "A", "B", "C", "D", "E", "F"]; //(blue)
  const colorNumbers = [];
  let subjectAsciiNumber = 0;
  for (let i = 0; i < exam.subject.length; i++) {
    // console.log(exam.subject.charCodeAt(i));
    subjectAsciiNumber += exam.subject.charCodeAt(i);
    // console.log("total: " + subjectAsciiNumber);
  }
  // console.log("sum: " + subjectAsciiNumber);
  // console.log("sum2: " + Math.round(subjectAsciiNumber + Math.random() * 10));
  // console.log("sum: " + (subjectAsciiNumber % hexCharsFirstDigit.length));
  colorNumbers.push(
    Math.round(subjectAsciiNumber * Math.random() * 10) %
      hexCharsFirstTwoDigits.length
  );
  // colorNumbers.push(
  //   Math.round(
  //     exam.subject.length +
  //       Math.random() * 10 +
  //       exam.examDate.getDay() +
  //       exam.examDate.getMonth() +
  //       exam.startDate.getDay() +
  //       exam.startDate.getMonth() +
  //       exam.numberPages * exam.timesRepeat * exam.timePerPage
  //   ) % hexCharsFirstDigit.length
  // );

  colorNumbers.push(
    Math.round(
      exam.examDate.getDay() + exam.examDate.getMonth() * Math.random() * 10
    ) % hexCharsFirstTwoDigits.length
  );
  colorNumbers.push(
    Math.round(
      exam.startDate.getDay() + exam.startDate.getMonth() * Math.random() * 10
    ) % hexCharsSecondTwoDigits.length
  );
  //TO AVOID WHITE
  // let thirdColor =
  //   (exam.startDate.getDay() + exam.startDate.getMonth()) % hexChars.length;
  // if (thirdColor === 10) thirdColor = 6;
  // console.log(thirdColor);
  // colorNumbers.push(thirdColor);
  colorNumbers.push(
    Math.round(exam.numberPages * exam.timesRepeat * Math.random() * 10) %
      hexCharsSecondTwoDigits.length
  );
  colorNumbers.push(exam.timePerPage % hexCharsThirdTwoDigits.length);
  colorNumbers.push(
    (colorNumbers[0] +
      colorNumbers[1] +
      colorNumbers[2] +
      colorNumbers[3] +
      colorNumbers[4]) %
      hexCharsThirdTwoDigits.length
  );

  // colorNumbers.push(0);
  // colorNumbers.push(1);
  // colorNumbers.push(2);
  // colorNumbers.push(3);
  // colorNumbers.push(4);
  // colorNumbers.push(5);
  // console.log(colorNumbers);
  let color = "#";

  let counter = 0;
  colorNumbers.forEach(colorNumber => {
    if (counter < 2) color += hexCharsFirstTwoDigits[colorNumber].toString();
    else if (counter < 4)
      color += hexCharsSecondTwoDigits[colorNumber].toString();
    else color += hexCharsThirdTwoDigits[colorNumber].toString();

    counter++;
  });

  return color;
}

export function learningIsComplete(
  currentPage,
  startPage,
  numberPages,
  repeat = 1
) {
  // console.log("IN LEARNING COMPLETE FUNCTION");

  const endPage = startPage + numberPages * repeat - 1;

  return currentPage > endPage;
}

export function escapeExamObject(exam) {
  exam.subject = escapeStringForHtml(exam.subject);
  exam.notes = escapeStringForHtml(exam.notes);
  // exam.studyMaterialLinks = escapeArrayForHtml(exam.studyMaterialLinks);

  return exam;
}

export function escapeExamObjects(exams) {
  const escapedExams = [];
  exams.forEach(exam => {
    escapedExams.push(escapeExamObject(exam));
  });
  return escapedExams;
}

export function escapeTodaysChunksObjects(chunks) {
  chunks.forEach(chunk => {
    chunk.exam = escapeExamObject(chunk.exam);
  });
  return chunks;
}

export function escapeCalendarObjects(calendarObjects) {
  calendarObjects.forEach(calendarObject => {
    calendarObject.title = escapeStringForHtml(calendarObject.title);
  });
  return calendarObjects;
}

function verifyNewExamInputFormat(args) {
  verifySubjectFormat(args.subject);
  verifyNumberPagesFormat(args.numberPages);
  verifyTimePerPageFormat(args.timePerPage);
  verifyTimesRepeatFormat(args.timesRepeat);
  verifyStartPageFormat(args.startPage);
  verifyNotesFormat(args.notes);
  verifyStudyMaterialLinksFormat(args.studyMaterialLinks);
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

function verifyStudyMaterialLinksFormat(studyMaterialLinks) {
  if (!studyMaterialLinks) return;
  if (studyMaterialLinks.length === 0) return;

  studyMaterialLinks.forEach(link => {
    if (link === null || !validator.isURL(link) || !verifyRegexUrlLink(link))
      throw new AuthenticationError(
        "All the study material links have to be URLs (websites) (e.g. https://stan-studyplan.herokuapp.com)."
      );
  });
}

function verifyNotesFormat(notes) {
  if (notes != null && !verifyRegexPageNotes(notes))
    throw new AuthenticationError(
      "Notes input has the wrong format. It cannot exceed 100000000 characters."
    );
}
