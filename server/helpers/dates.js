const dayjs = require("dayjs");

export function datesTimingIsValid(startDate, examDate) {
  return (
    datesAreNotPast([startDate, examDate]) &&
    startDateIsBeforeExamDate(startDate, examDate)
  );
}

function datesAreNotPast(dates) {
  for (let i = 0; i < dates.length; i++) {
    //if today is after the date, then it is in the past
    if (dayjs().isAfter(dayjs(dates[i]))) {
      return false;
    }
  }
  return true;
}

function startDateIsBeforeExamDate(startDate, examDate) {
  return dayjs(startDate).isBefore(dayjs(examDate));
}
