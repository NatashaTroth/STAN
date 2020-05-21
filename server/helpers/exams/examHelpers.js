import { verifyExamInput, verifyUpdateExamDates } from "./validateExamInput";
import { ApolloError } from "apollo-server";
import { Exam } from "../../models";
import { escapeStringForHtml } from "../generalHelpers";
import { getBackgroundColor, generateTextColor } from "./colors";
import {
  // startDateIsActive,
  getNumberOfDays
} from "../dates";

export async function fetchExam(examId, userId) {
  const exam = await Exam.findOne({
    _id: examId,
    userId
  });
  if (!exam) throw new ApolloError("This exam does not exist.");
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

export function learningIsComplete(currentPage, startPage, numberPages, repeat = 1) {
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
