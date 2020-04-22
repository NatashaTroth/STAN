import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

export function datesTimingIsValid(startDate, examDate) {
  // console.log(datesAreNotPast([startDate, examDate]));
  // console.log(date1IsBeforeDate2(startDate, examDate));
  return (
    datesAreNotPast([startDate, examDate]) &&
    date1IsBeforeDate2(startDate, examDate)
  );
}

export function startDateIsActive(startDate) {
  return isToday(startDate) || dayjs(startDate).isBefore(dayjs());
}

export function isTheSameDay(date1, date2) {
  return dayjs(date1).isSame(dayjs(date2));
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

//TODO: TEST
export function datesAreNotPast(dates) {
  for (let i = 0; i < dates.length; i++) {
    // console.log(dates[i]);

    //if today is after the date, then it is in the past
    if (dayjs(dates[i]).isBefore(dayjs()) && !isToday(dates[i])) {
      return false;
    }
  }
  return true;
}

export function date1IsBeforeDate2(date1, date2) {
  // console.log(startDate, examDate);
  return dayjs(date1).isBefore(dayjs(date2));
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
