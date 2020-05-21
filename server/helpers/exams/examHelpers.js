import { verifyExamInput, verifyUpdateExamDates } from "./validateExamInput";
import { ApolloError } from "apollo-server";
import { Exam } from "../../models";

import { escapeStringForHtml } from "../generalHelpers";
import {
  // startDateIsActive,
  getNumberOfDays
} from "../dates";

import tinycolor from "tinycolor2";

export async function fetchExam(examId, userId) {
  const exam = await Exam.findOne({
    _id: examId,
    userId
  });
  if (!exam)
    throw new ApolloError("No exam exists with this exam id: " + examId + " for this user.");
  return exam;
}

export function prepareExamInputData(args, userId) {
  args.examDate = new Date(args.examDate);
  if (!args.startDate || args.startDate.length <= 0) {
    args.startDate = new Date();
  }
  args.startPage = args.startPage || 1;
  args.numberPages = calcNumberPagesFromPageNumbers(args.startPage, args.lastPage);
  args.timesRepeat = args.timesRepeat || 1;
  args.currentPage = args.currentPage || args.startPage;
  args.completed = args.completed || false;
  args.userId = userId;
  args.color = getBackgroundColor(args.color, args);
  args.textColor = generateTextColor(args.color);
  args.totalNumberDays = getNumberOfDays(args.startDate, args.examDate);
  args.updatedAt = new Date();
  return { ...args };
}

function getBackgroundColor(color, args) {
  const tinycolorResp = tinycolor(color);
  if (tinycolorResp.isValid()) return color;
  return generateSubjectColor(args);
}

function generateTextColor(backgroundColor) {
  const backgroundColorBrightness = tinycolor(backgroundColor).getBrightness();
  //255 shades, 5 different possible grades in the frontend, the two darkest ones should have a white text color
  if (backgroundColorBrightness <= (255 / 5) * 2) return "#ffffff";
  return "#000000";
}
export function calcNumberPagesFromPageNumbers(startPage, lastPage) {
  if (lastPage < startPage) throw new Error("The last page should be higher than the start page.");
  return lastPage - startPage + 1;
}

export async function handleUpdateExamInput(exam, args, userId) {
  //TODO: CHANGE NOT GOOD - MIGHT NOT BE START DATE, AND ORIGINAL STARTDATE MIGHT BE IN THE PAST
  // console.log("HERE");
  // console.log(args.startDate + " " + args.examDate);
  verifyExamInput(args, userId);
  verifyUpdateExamDates(args.startDate, args.examDate, exam.startDate);
  args.numberPages = calcNumberPagesFromPageNumbers(args.startPage, args.lastPage);
  args.color = getBackgroundColor(args.color, args);
  args.textColor = generateTextColor(args.color);
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
  if (!exam) throw new ApolloError("There is no exam with the id: " + examId + " for that user.");
  if (page < exam.startPage)
    throw new ApolloError("The entered current page is lower than the start page for this exam.");
  if (page > exam.numberPages * exam.timesRepeat + exam.startPage)
    throw new ApolloError(
      "The entered current page is higher than the number of pages for this exam."
    );

  // console.log("checking exam learning complete not chunk");
  exam.completed = learningIsComplete(page, exam.startPage, exam.numberPages, exam.timesRepeat);

  return exam;
}

//middle color
//fist light
function generateSubjectColor(exam) {
  const hexCharsFirstTwoDigits = ["A", "B", "C", "D", "E", "F"]; //(red)
  const hexCharsSecondTwoDigits = [9, "A", "B", "C", "D", "E", "F"]; //(green)
  const hexCharsThirdTwoDigits = [9, "A", "B", "C", "D", "E", "F"]; //(blue)
  const colorNumbers = [];
  let subjectAsciiNumber = 0;
  for (let i = 0; i < exam.subject.length; i++) {
    subjectAsciiNumber += exam.subject.charCodeAt(i);
  }
  colorNumbers.push(
    Math.round(subjectAsciiNumber * Math.random() * 10) % hexCharsFirstTwoDigits.length
  );

  colorNumbers.push(
    Math.round(exam.examDate.getDay() + exam.examDate.getMonth() * Math.random() * 10) %
      hexCharsFirstTwoDigits.length
  );
  colorNumbers.push(
    Math.round(exam.startDate.getDay() + exam.startDate.getMonth() * Math.random() * 10) %
      hexCharsSecondTwoDigits.length
  );
  colorNumbers.push(
    Math.round(exam.numberPages * exam.timesRepeat * Math.random() * 10) %
      hexCharsSecondTwoDigits.length
  );
  colorNumbers.push(exam.timePerPage % hexCharsThirdTwoDigits.length);
  colorNumbers.push(
    (colorNumbers[0] + colorNumbers[1] + colorNumbers[2] + colorNumbers[3] + colorNumbers[4]) %
      hexCharsThirdTwoDigits.length
  );
  let color = "#";
  let counter = 0;
  colorNumbers.forEach(colorNumber => {
    if (counter < 2) color += hexCharsFirstTwoDigits[colorNumber].toString();
    else if (counter < 4) color += hexCharsSecondTwoDigits[colorNumber].toString();
    else color += hexCharsThirdTwoDigits[colorNumber].toString();
    counter++;
  });

  return color;
}

export function learningIsComplete(currentPage, startPage, numberPages, repeat = 1) {
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
