import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

export function datesTimingIsValid(startDate, examDate) {
  return (
    datesAreNotPast([startDate, examDate]) &&
    startDateIsBeforeExamDate(startDate, examDate)
  );
}

export function startDateIsActive(startDate) {
  return isToday(startDate) || dayjs(startDate).isBefore(dayjs());
}

export function getNumberOfDays(startDate, examDate) {
  //source: https://stackoverflow.com/a/2627493 &  https://stackoverflow.com/a/17727953
  const start = Date.UTC(
    examDate.getFullYear(),
    examDate.getMonth(),
    examDate.getDate()
  );
  const end = Date.UTC(
    startDate.getFullYear(),
    startDate.getMonth(),
    startDate.getDate()
  );

  const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
  return Math.round(Math.abs((start - end) / oneDay));
}

//------------------------HELPERS--------------------

function datesAreNotPast(dates) {
  for (let i = 0; i < dates.length; i++) {
    // console.log(dates[i]);

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
