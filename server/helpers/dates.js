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
    if (dayjs(dayjs(dates[i])).isBefore(dayjs()) && !isToday(dates[i])) {
      return false;
    }
  }
  return true;
}

function startDateIsBeforeExamDate(startDate, examDate) {
  return dayjs(startDate).isBefore(dayjs(examDate));
}

//modified from https://flaviocopes.com/how-to-determine-date-is-today-javascript/
function isToday(date) {
  const today = new Date();
  return (
    date.getDate() == today.getDate() &&
    date.getMonth() == today.getMonth() &&
    date.getFullYear() == today.getFullYear()
  );
}
