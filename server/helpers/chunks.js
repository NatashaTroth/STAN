import { ApolloError } from "apollo-server";
import { Exam, TodaysChunkCache } from "../models";

// import { roundToTwoDecimals } from "../helpers/generalHelpers";
import {
  // datesTimingIsValid,
  startDateIsActive,
  // isTheSameDay,
  getNumberOfDays
  // startDateIsBeforeExamDate
} from "../helpers/dates";

export function numberOfPagesForChunk({
  numberOfPages,
  currentPage,
  daysLeft,
  repeat
}) {
  if (
    isNaN(numberOfPages) ||
    isNaN(currentPage) ||
    isNaN(daysLeft) ||
    isNaN(repeat)
  )
    throw new Error("Not all arguments for numberOfPagesForChunk are numbers.");
  let pagesLeft = numberOfPages * repeat - currentPage + 1;

  return Math.ceil(pagesLeft / daysLeft);
}

export async function fetchTodaysChunks(userId) {
  const currentExams = await fetchCurrentExams(userId);
  const chunks = calculateTodaysChunks(currentExams);
  // await TodaysChunkCache.insertMany(chunks).then(resp => console.log(resp));

  return chunks;
}

export async function fetchCalendarChunks(userId) {
  const exams = await Exam.find({
    userId: userId,
    completed: false
  }).sort({ subject: "asc" });
  // const currentExams = await fetchCurrentExams(userId);
  return getCalendarChunks(exams);
}

async function fetchCurrentExams(userId) {
  const exams = await Exam.find({
    userId: userId,
    completed: false
  }).sort({ examDate: "asc" });
  const currentExams = exams.filter(exam => {
    return startDateIsActive(new Date(exam.startDate));
  });
  return currentExams;
}

async function calculateTodaysChunks(currentExams) {
  const chunks = currentExams.map(async exam => {
    const daysLeft = getNumberOfDays(new Date(), exam.examDate);
    //but should never come to this - but to avoid Infinity error
    //TODO: REMOVE
    if (daysLeft <= 0)
      throw new ApolloError(
        "Start date and exam date were the same for " + exam.subject + "."
      );
    if (exam.currentPage > exam.numberPages * exam.timesRepeat)
      throw new ApolloError(
        "The current page is higher than the number of pages for this exam."
      );
    const numberPagesToday = numberOfPagesForChunk({
      numberOfPages: exam.numberPages,
      currentPage: exam.currentPage,
      daysLeft,
      repeat: exam.timesRepeat
    });

    const duration =
      exam.timePerPage > 0 ? exam.timePerPage * numberPagesToday : null;
    const chunk = {
      exam,
      numberPagesToday,
      duration,
      daysLeft,
      totalNumberDays: getNumberOfDays(exam.startDate, exam.examDate),
      numberPagesWithRepeat: exam.numberPages * exam.timesRepeat,
      notEnoughTime: false //TODO: IMPLEMENT
    };
    await addTodaysChunkToDatabase(chunk, exam.userId);
    return chunk;
  });
  return await Promise.all(chunks);
}

async function addTodaysChunkToDatabase(chunk, userId) {
  // console.log("Adding to db");
  // {
  //   "exam": {
  //     "id": "5e988b6dfb66edc7290debb1",
  //     "subject": "Maths",
  //     "examDate": "2020-05-05T00:00:00.000Z",
  //     "startDate": "2020-04-20T00:00:00.000Z",
  //     "numberPages": 53,
  //     "timesRepeat": 1,
  //     "currentPage": 0,
  //     "pdfLink": "TODO: CHANGE LATER"
  //   },
  //   "numberPagesToday": 4,
  //   "duration": 16,
  //   "daysLeft": 15,
  //   "totalNumberDays": 15,
  //   "numberPagesWithRepeat": 53,
  //   "notEnoughTime": false
  // }
  try {
    //TODO: HANDLE Chunk COMPLETED
    const resp = await TodaysChunkCache.create({
      examId: chunk.exam.id,
      userId,
      numberPagesToday: chunk.numberPagesToday,
      duration: chunk.duration,
      startPage: chunk.exam.currentPage,
      currentPage: chunk.exam.currentPage,
      completed: false
    });
    if (!resp) throw new Error();
    // console.log("Added to db");

    // console.log(resp);
  } catch (err) {
    console.log(err);
    throw new Error("Could not add todays chunk to db");
  }
}

function getCalendarChunks(exams) {
  const chunks = [];

  for (let i = 0; i < exams.length; i++) {
    const exam = exams[i];

    //TODO - BETWEEN STARTDATE OR TODAY
    let dayToStartCounting = exam.startDate;
    if (startDateIsActive(exam.startDate)) dayToStartCounting = new Date();
    const daysLeft = getNumberOfDays(dayToStartCounting, exam.examDate);

    const numberPagesLeftTotal =
      exam.numberPages * exam.timesRepeat - exam.currentPage + 1;
    const numberPagesPerDay = Math.ceil(numberPagesLeftTotal / daysLeft);

    chunks.push({
      subject: exam.subject,
      start: exam.startDate,
      end: exam.examDate,
      details: {
        examDate: exam.examDate,
        currentPage: exam.currentPage,
        numberPagesLeftTotal,
        numberPagesPerDay,
        durationTotal: numberPagesLeftTotal * exam.timePerPage,
        durationPerDay: Math.ceil(numberPagesPerDay * exam.timePerPage)
      },
      color: exam.color
    });
  }
  return chunks;
}

export async function getTodaysChunkProgress(userId) {
  //TODO: INDEX userid
  // console.log("here1");
  let todaysChunks = await TodaysChunkCache.find({ userId });
  // console.log(todaysChunks);

  if (!todaysChunks || todaysChunks.length <= 0)
    todaysChunks = await fetchTodaysChunks(userId);
  // console.log(todaysChunks);
  // console.log(todaysChunks);

  return calculateChunkProgress(todaysChunks);
}

//TODO: EXPORT TO CHUNKS.JS?
function calculateChunkProgress(chunks) {
  //TODO: HANDLE Chunk COMPLETED
  let totalDuration = 0;
  let totalDurationCompleted = 0;
  chunks.forEach(chunk => {
    // {
    //   "exam": {
    //     "id": "5e988b6dfb66edc7290debb1",
    //     "subject": "Maths",
    //     "examDate": "2020-05-05T00:00:00.000Z",
    //     "startDate": "2020-04-20T00:00:00.000Z",
    //     "numberPages": 53,
    //     "timesRepeat": 1,
    //     "currentPage": 0,
    //     "pdfLink": "TODO: CHANGE LATER"
    //   },
    //   "numberPagesToday": 4,
    //   "duration": 16,
    //   "daysLeft": 15,
    //   "totalNumberDays": 15,
    //   "numberPagesWithRepeat": 53,
    //   "notEnoughTime": false
    // }
    //TODO: CACHE AND NOT CACHE OBEJECTS SHOULD LOOK THE SAME SO DON'T HAVE ALL THIS:
    totalDuration += chunk.duration;
    // console.log(chunk.currentPage);
    let currentPage;
    if (chunk.exam) currentPage = chunk.exam.currentPage;
    else currentPage = chunk.currentPage;
    let startPage = chunk.startPage;
    // console.log(startPage);
    //todo: not working
    if (startPage == null) {
      // console.log("in if");
      startPage = currentPage;
    }
    // if (!Object.prototype.hasOwnProperty.call(chunk, "startPage")) {
    //   console.log("in if");
    //   startPage = currentPage;
    // }

    totalDurationCompleted += durationCompleted({
      duration: chunk.duration,
      startPage,
      currentPage: currentPage,
      numberPages: chunk.numberPagesToday
    });
    // console.log(".........");
    // console.log(
    //   durationCompleted({
    //     duration: chunk.duration,
    //     startPage,
    //     currentPage: currentPage,
    //     numberPages: chunk.numberPagesToday
    //   })
    // );
    // console.log(chunk.duration);
    // console.log(startPage); //16

    // console.log(currentPage);
    // console.log(chunk.numberPagesToday);
  });
  console.log("-----------");
  //duration ..... 100%
  //duration completed ... x

  console.log(totalDuration);
  console.log(totalDurationCompleted);
  if (totalDuration === 0) return 0;
  // console.log((100 / totalDuration) * totalDurationCompleted);
  return Math.round((100 / totalDuration) * totalDurationCompleted);
}

// export function calculateUserState(chunks){
//   let totalDuration
//   chunks.forEach(chunk => {
//     // type TodaysChunk {
//     //   exam: Exam!
//     //   numberPagesToday: Int!
//     //   duration: Int
//     //   daysLeft: Int! #incl. today
//     //   totalNumberDays: Int!
//     //   numberPagesWithRepeat: Int! #exam.pages*repeat
//     //   notEnoughTime: Boolean!
//     // }

//   })
// }

export function durationCompleted({
  duration,
  startPage,
  currentPage,
  numberPages
}) {
  // console.log("here");
  // console.log(startPage);
  const timePerPage = duration / numberPages;
  // const endPage = startPage + numberPages - 1;
  // const numberOfpagesLeft = endPage - currentPage + 1;
  const numberOfpagesCompleted = currentPage - startPage;

  return numberOfpagesCompleted * timePerPage;
}

// export function durationLeft({
//   duration,
//   startPage,
//   currentPage,
//   numberPages
// }) {
//   const timePerPage = duration / numberPages;
//   const endPage = startPage + numberPages - 1;
//   const numberOfpagesLeft = endPage - currentPage + 1;

//   return numberOfpagesLeft * timePerPage;
// }
