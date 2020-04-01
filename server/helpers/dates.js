const dayjs = require("dayjs");

export function datesTimingIsValid(startDate, examDate) {
  return (
    datesAreNotPast([startDate, examDate]) &&
    startDateIsBeforeExamDate(startDate, examDate)
  );
}

export function startDateIsActive(startDate) {
  return isToday(startDate) || dayjs(startDate).isBefore(dayjs());
}

export function numberOfDaysLeft(startDate, examDate) {
  console.log(dayjs(startDate).to(dayjs(examDate)));
  // return dayjs().fromNow();
}

//------------------------HELPERS--------------------

function datesAreNotPast(dates) {
  for (let i = 0; i < dates.length; i++) {
    //if today is after the date, then it is in the past
    if (dayjs(dates[i]).isBefore(dayjs()) && !isToday(dates[i])) {
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
