import {
  verifyRegexSubject,
  verifyRegexPageAmount,
  verifyRegexPageTime,
  verifyRegexPageRepeat,
  // verifyRegexHexColor,
  verifyRegexCurrentPage,
  verifyRegexPageNotes,
  verifyRegexUrlLink
} from "../verifyInput";
import { AuthenticationError, ApolloError } from "apollo-server";

import { removeWhitespace } from "../generalHelpers";
import {
  datesTimingIsValid,
  // startDateIsActive,
  isTheSameDay,
  date1IsBeforeDate2
} from "../dates";
import validator from "validator";

export function verifyExamInput(args) {
  //regex
  verifyNewExamInputFormat(args);

  if (isTheSameDay(args.startDate, args.examDate)) {
    throw new ApolloError(
      "Careful! You shouldn't start learning on the same day as the test. Start date should be at least 1 day before the test."
    );
  }

  // if (args.startPage && args.startPage > args.lastPage)
  //   throw new ApolloError("Start page cannot higher than the number of pages.");
}

function verifyNewExamInputFormat(args) {
  verifySubjectFormat(args.subject);
  verifyLastPageFormat(args.lastPage);
  verifyTimePerPageFormat(args.timePerPage);
  verifyTimesRepeatFormat(args.timesRepeat);
  verifyStartPageFormat(args.startPage);
  // verifyHexColorFormat(args.color, args);
  verifyNotesFormat(args.notes);
  verifyStudyMaterialLinksFormat(args.studyMaterialLinks);
}

function verifySubjectFormat(subject) {
  if (!verifyRegexSubject(subject))
    throw new AuthenticationError(
      "Subject input has the wrong format. It cannot be empty. Max length 50 characters."
    );
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

function verifyLastPageFormat(lastPage) {
  if (!verifyRegexPageAmount(lastPage.toString()))
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
    link = removeWhitespace(link);
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
