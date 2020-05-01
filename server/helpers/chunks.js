//TODO CHANGE ORDER of all the functions
// import { ApolloError } from "apollo-server";
import { Exam, TodaysChunkCache } from "../models";

import {
  startDateIsActive,
  getNumberOfDays,
  isTheSameDay
} from "../helpers/dates";

import {
  learningIsComplete
  // handleCurrentPageInput
} from "../helpers/examHelpers";
import { ApolloError } from "apollo-server";

//---------------------------TODAY'S CHUNKS---------------------------

export async function fetchTodaysChunks(userId) {
  const currentExams = await fetchCurrentExams(userId);
  let chunks;
  let todaysChunksFromCache = await fetchTodaysChunksFromCache(userId);

  if (!todaysChunksFromCache || todaysChunksFromCache.length <= 0) {
    // console.log("cache empty");
    chunks = await calculateTodaysChunks(currentExams);
  } else {
    // console.log("cache not empty");
    chunks = await createTodaysChunksFromCache(
      currentExams,
      todaysChunksFromCache
    );
  }

  return chunks;
}

async function fetchTodaysChunksFromCache(userId) {
  return await TodaysChunkCache.find({ userId });
}
async function createTodaysChunksFromCache(currentExams, todaysChunks) {
  const chunks = currentExams.map(async exam => {
    let chunk = todaysChunks.find(chunk => chunk.examId === exam.id);

    //cache calculated from scratch
    if (!chunk || !chunkCacheIsValid(chunk.updatedAt, exam.updatedAt)) {
      // console.log("invalid cache");

      const newChunk = createTodaysChunkObject(exam);
      if (!chunk) {
        await addTodaysChunkToDatabase(newChunk, exam.userId);
      } else {
        const resp = await TodaysChunkCache.updateOne(
          { _id: chunk._id },
          newChunk
        );
        if (!resp) throw new Error("Unable to update today's chunk cache.");
      }
      chunk = newChunk;
    }

    return {
      exam,
      numberPagesToday: chunk.numberPagesToday,
      startPage: chunk.startPage,
      currentPage: chunk.currentPage,
      durationToday: chunk.durationToday,
      daysLeft: chunk.daysLeft,
      notEnoughTime: chunk.notEnoughTime,
      completed: chunk.completed
    };
  });
  const resp = await Promise.all(chunks);

  return resp;
}

export function chunkCacheIsValid(chunkUpdatedAt, examUpdatedAt) {
  return isTheSameDay(chunkUpdatedAt, new Date());
  //TODO do i need this? don't think so now
  // && date1IsBeforeDate2(examUpdatedAt, chunkUpdatedAt)
}

export async function handleUpdateExamInTodaysChunkCache(
  userId,
  exam,
  newArgs
) {
  // console.log("in handleUpdateExamInTodaysChunkCache");
  const todaysChunkCache = await TodaysChunkCache.findOne({
    examId: exam._id.toString(),
    userId
  });

  if (!todaysChunkCache) return;

  if (chunkHasToBeChanged(exam, newArgs)) {
    // console.log("chunk has to be changed");

    const updates = filterOutUpdatesInTodaysChunk(
      exam,
      newArgs,
      todaysChunkCache
    );
    //TODO EXTRAct
    const updateCacheResp = await TodaysChunkCache.updateOne(
      {
        examId: exam._id.toString(),
        userId
      },
      {
        ...updates
      }
    );

    if (updateCacheResp.ok !== 1 || updateCacheResp.nModified !== 1)
      throw new ApolloError("The todays chunk cache could not be updated.");
  } else {
    // console.log("chunk has not changed much");
    const updates = {};
    let updateNeeded = false;
    if (exam.currentPage !== newArgs.currentPage) {
      updates.currentPage = newArgs.currentPage;
      updateNeeded = true;
    }
    if (exam.timePerPage !== newArgs.timePerPage) {
      updates.durationToday =
        todaysChunkCache.numberPagesToday * newArgs.timePerPage;
      updateNeeded = true;
    }
    updates.completed = todaysChunkIsCompleted(
      newArgs.currentPage,
      todaysChunkCache
    );

    if (updateNeeded) {
      // console.log("update was needed");
      //TODO EXTRAct

      const updateCacheResp = await TodaysChunkCache.updateOne(
        {
          examId: exam._id.toString(),
          userId
        },
        {
          ...updates
        }
      );
      if (updateCacheResp.ok !== 1 || updateCacheResp.nModified !== 1)
        throw new ApolloError("The todays chunk cache could not be updated.");
    }
  }
}

function chunkHasToBeChanged(oldExam, newArgs) {
  return (
    !isTheSameDay(oldExam.examDate, newArgs.examDate) ||
    !isTheSameDay(oldExam.startDate, newArgs.startDate) ||
    oldExam.numberPages !== newArgs.numberPages ||
    oldExam.timesRepeat !== newArgs.timesRepeat ||
    oldExam.startPage !== newArgs.startPage
  );
}

export async function handleUpdateCurrentPageInTodaysChunkCache(
  userId,
  examId,
  page
) {
  const todaysChunkCache = await TodaysChunkCache.findOne({
    examId: examId,
    userId
  });

  if (!todaysChunkCache) return;

  let completed = todaysChunkIsCompleted(page, todaysChunkCache);

  const updateCacheResp = await TodaysChunkCache.updateOne(
    { examId: examId, userId },
    {
      currentPage: page,
      completed
    }
  );

  if (updateCacheResp.ok !== 1 || updateCacheResp.nModified !== 1)
    throw new ApolloError(
      "The todays chunk cache current page could not be updated."
    );
}

function todaysChunkIsCompleted(currentPage, todaysChunkCache) {
  let completed = todaysChunkCache.completed;
  if (
    learningIsComplete(
      currentPage,
      todaysChunkCache.startPage,
      todaysChunkCache.numberPagesToday,
      1
    )
  )
    completed = true;
  return completed;
}

function filterOutUpdatesInTodaysChunk(exam, newArgs, oldChunk) {
  let updates;
  const newChunk = createTodaysChunkObject(newArgs);
  const durationAlreadyLearned =
    calcCompletedDuration(oldChunk) + oldChunk.durationAlreadyLearned;

  const totalDurationLeft =
    newChunk.exam.numberPages * newChunk.exam.timePerPage;

  const dailyDurationWithCompletedDuration =
    (totalDurationLeft + durationAlreadyLearned) / newChunk.daysLeft;

  let durationToday = Math.ceil(
    dailyDurationWithCompletedDuration - durationAlreadyLearned
  );

  if (durationToday < 0) durationToday = 0;

  const numberPagesToday = Math.ceil(durationToday / newChunk.exam.timePerPage);

  durationToday = numberPagesToday * newChunk.exam.timePerPage;

  updates = {
    numberPagesToday,
    durationToday,
    startPage: newChunk.currentPage,
    currentPage: newChunk.currentPage,
    daysLeft: newChunk.daysLeft,
    notEnoughTime: newChunk.notEnoughTime,
    durationAlreadyLearned,
    completed: newChunk.completed
  };

  return updates;
}

function calcCompletedDuration(chunk) {
  const timePerPage = chunk.durationToday / chunk.numberPagesToday;
  const numberOfCompletedPages = chunk.currentPage - chunk.startPage;

  return timePerPage * numberOfCompletedPages;
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

// export async function todaysChunkCacheEmpty(userId) {
//   return (await TodaysChunkCache.countDocuments({ userId })) === 0;
// }

async function calculateTodaysChunks(currentExams) {
  const chunks = currentExams.map(async exam => {
    const chunk = createTodaysChunkObject(exam);
    await addTodaysChunkToDatabase(chunk, exam.userId);
    return chunk;
  });
  return await Promise.all(chunks);
}

function createTodaysChunkObject(exam) {
  const daysLeft = getNumberOfDays(new Date(), exam.examDate);

  const numberPagesToday = numberOfPagesForChunk({
    numberOfPages: exam.numberPages,
    startPage: exam.startPage,
    currentPage: exam.currentPage,
    daysLeft,
    repeat: exam.timesRepeat
  });

  //TODO: WHAT IS THIS? - CHECK, DURATION TODAY IS CREATED AS FLOAT SOMEWHERE
  const durationToday =
    exam.timePerPage > 0 ? exam.timePerPage * numberPagesToday : null;
  const chunk = {
    exam,
    numberPagesToday,
    startPage: exam.currentPage,
    currentPage: exam.currentPage,
    durationToday,
    daysLeft,
    notEnoughTime: false, //TODO: IMPLEMENT
    completed: false
  };

  return chunk;
}

async function addTodaysChunkToDatabase(chunk, userId) {
  try {
    //TODO: HANDLE Chunk COMPLETED
    // console.log("adding cache to db");
    const resp = await TodaysChunkCache.create({
      examId: chunk.exam.id,
      userId,
      numberPagesToday: chunk.numberPagesToday,
      durationToday: chunk.durationToday,
      startPage: chunk.exam.currentPage,
      currentPage: chunk.exam.currentPage,
      daysLeft: chunk.daysLeft,
      notEnoughTime: chunk.notEnoughTime,
      completed: false
    });
    if (!resp) throw new Error();
  } catch (err) {
    throw new Error("Could not add todays chunk to db. " + err.message);
  }
}

//---------------------------TODAY'S CHUNKS PROGRESS---------------------------

export async function getTodaysChunkProgress(userId) {
  //TODO: INDEX userid
  const todaysChunks = await fetchTodaysChunks(userId);
  return calculateChunkProgress(todaysChunks);
}

export function calculateChunkProgress(chunks) {
  // console.log("IN CALC PROGRESS:");

  if (chunks.length <= 0) return 100;
  let totalDuration = 0;
  let totalDurationCompleted = 0;
  chunks.forEach(chunk => {
    //INDEX USERID FOR TODAYSCHUNKS AND EXAMID FOR EXAMSs

    totalDuration += chunk.durationToday;

    totalDurationCompleted += durationCompleted({
      duration: chunk.durationToday,
      startPage: chunk.startPage,
      currentPage: chunk.currentPage,
      numberPages: chunk.numberPagesToday,
      completed: chunk.completed
    });
    // console.log(".........");
    // console.log("durationToday:" + chunk.durationToday);
    // console.log("startPage:" + chunk.startPage); //16

    // console.log("currentPage:" + chunk.exam.currentPage);
    // console.log("numberPagesToday:" + chunk.numberPagesToday);
  });

  // console.log("-----------");
  // console.log("totalDuration:" + totalDuration);
  // console.log("totalDurationCompleted:" + totalDurationCompleted);

  //duration ..... 100%
  //duration completed ... x
  if (totalDuration === 0) return 0;
  return Math.round((100 / totalDuration) * totalDurationCompleted);
}

export function durationCompleted({
  duration,
  startPage,
  currentPage,
  numberPages,
  completed
}) {
  if (completed || learningIsComplete(currentPage, startPage, numberPages, 1))
    return duration;
  const timePerPage = duration / numberPages;
  const numberOfpagesCompleted = currentPage - startPage;
  return numberOfpagesCompleted * timePerPage;
}

//---------------------------CALENDAR CHUNKS---------------------------

export async function fetchCalendarChunks(userId) {
  const exams = await Exam.find({
    userId: userId,
    completed: false
  }).sort({ examDate: "asc" });
  return getCalendarChunks(exams);
}

function getCalendarChunks(exams) {
  const chunks = [];

  for (let i = 0; i < exams.length; i++) {
    const exam = exams[i];

    //TODO - BETWEEN STARTDATE OR TODAY
    let dayToStartCounting = exam.startDate;
    if (startDateIsActive(exam.startDate)) dayToStartCounting = new Date();
    const daysLeft = getNumberOfDays(dayToStartCounting, exam.examDate);

    const numberPagesLeftTotal = calcPagesLeft(
      exam.numberPages,
      exam.timesRepeat,
      exam.startPage,
      exam.currentPage
    );
    // exam.numberPages * exam.timesRepeat - exam.currentPage + 1;
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

//---------------------------HELPERS---------------------------

export function numberOfPagesForChunk({
  numberOfPages,
  startPage,
  currentPage,
  daysLeft,
  repeat
}) {
  if (
    isNaN(numberOfPages) ||
    isNaN(startPage) ||
    isNaN(currentPage) ||
    isNaN(daysLeft) ||
    isNaN(repeat)
  )
    throw new Error("Not all arguments for numberOfPagesForChunk are numbers.");
  // console.log("numberOfPages: " + numberOfPages);
  // console.log("startPage: " + startPage);
  // console.log("currentPage: " + currentPage);
  // console.log("daysLeft: " + daysLeft);
  // console.log("repeat: " + repeat);
  // const endPageInclRepeat = numberOfPages * repeat + startPage;
  // let pagesLeft = endPageInclRepeat - currentPage;
  const pagesLeft = calcPagesLeft(
    numberOfPages,
    repeat,
    startPage,
    currentPage
  );
  // console.log("pagesLeft: " + pagesLeft);

  return Math.ceil(pagesLeft / daysLeft);
}

function calcPagesLeft(numberOfPages, repeat, startPage, currentPage) {
  const endPageInclRepeat = numberOfPages * repeat + startPage;
  return endPageInclRepeat - currentPage;
}
