//TODO CHANGE ORDER of all the functions
// import { ApolloError } from "apollo-server";
import { Exam, TodaysChunkCache } from "../models";

import {
  startDateIsActive,
  getNumberOfDays,
  date1IsBeforeDate2
} from "../helpers/dates";

//---------------------------TODAY'S CHUNKS---------------------------

export async function fetchTodaysChunks(userId) {
  const currentExams = await fetchCurrentExams(userId);
  let chunks;
  //if not in database

  let todaysChunksFromCache = await fetchTodaysChunksFromCache(userId);
  if (!todaysChunksFromCache || todaysChunksFromCache.length <= 0) {
    console.log("cache empty");
    chunks = await calculateTodaysChunks(currentExams);
    //TODO
    // await TodaysChunkCache.insertMany(chunks).then(resp => console.log(resp));
  } else {
    console.log("cache not empty");
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
    const chunk = todaysChunks.find(chunk => chunk.examId === exam.id);

    if (chunk && isChunkCacheValid(chunk.updatedAt, exam.updatedAt)) {
      console.log("valid cache");
      return {
        exam,
        numberPagesToday: chunk.numberPagesToday,
        startPage: chunk.startPage,
        currentPage: chunk.currentPage,
        durationToday: chunk.durationToday,
        daysLeft: chunk.daysLeft,
        notEnoughTime: chunk.notEnoughTime
      };
    } else {
      console.log("invalid cache");
      //TODO: better to update the existing one

      let newChunk = createTodaysChunkObject(exam);

      if (!chunk) {
        await addTodaysChunkToDatabase(newChunk, exam.userId);
      } else {
        const updates = filterOutUpdatesInTodaysChunk(chunk, newChunk);
        const resp = await TodaysChunkCache.updateOne(
          { _id: chunk._id },
          updates
        );
        newChunk = TodaysChunkCache.findOne({ _id: chunk._id });
      }
      return newChunk;
    }
  });
  const resp = await Promise.all(chunks);
  // console.log(resp);
  return resp;
}

function isChunkCacheValid(chunkUpdatedAt, examUpdatedAt) {
  return date1IsBeforeDate2(examUpdatedAt, chunkUpdatedAt);
}

function filterOutUpdatesInTodaysChunk(chunk, newChunk) {
  //TODO: refactor - ADD LOOP
  const updates = {};
  if (chunk.numberPagesToday !== newChunk.numberPagesToday)
    updates.numberPagesToday = newChunk.numberPagesToday;
  if (chunk.durationToday !== newChunk.durationToday)
    updates.durationToday = newChunk.durationToday;
  // if (chunk.startPage !== newChunk.startPage)
  //   updates.startPage = newChunk.startPage;
  if (chunk.currentPage !== newChunk.currentPage)
    updates.currentPage = newChunk.currentPage;
  if (chunk.daysLeft !== newChunk.daysLeft)
    updates.daysLeft = newChunk.daysLeft;
  if (chunk.notEnoughTime !== newChunk.notEnoughTime)
    updates.notEnoughTime = newChunk.notEnoughTime;
  //TODO
  // if (chunk.exam.completed !== newChunk.exam.completed)
  //   updates.exam.completed = newChunk.exam.completed;
  // console.log("filtering");
  // for (let key of Object.keys(chunk)) {
  //   if (chunk[key] !== newChunk[key]) updates[key] = newChunk[key];
  // }
  // console.log("updates:");
  // console.log(updates);
  return updates;
}

// async function deleteThisChunkCache(id) {
//   return await TodaysChunkCache.deleteOne({ _id: id });
// }

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

export async function todaysChunkCacheEmpty(userId) {
  return (await TodaysChunkCache.countDocuments({ userId })) === 0;
}

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
    currentPage: exam.currentPage,
    daysLeft,
    repeat: exam.timesRepeat
  });

  const durationToday =
    exam.timePerPage > 0 ? exam.timePerPage * numberPagesToday : null;
  const chunk = {
    exam,
    numberPagesToday,
    startPage: exam.currentPage,
    currentPage: exam.currentPage,
    durationToday,
    daysLeft,
    notEnoughTime: false //TODO: IMPLEMENT
  };

  return chunk;
}

async function addTodaysChunkToDatabase(chunk, userId) {
  try {
    // console.log("Adding chunks to database");

    //TODO: HANDLE Chunk COMPLETED
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
    console.log("added to db");
  } catch (err) {
    throw new Error("Could not add todays chunk to db. " + err.message);
  }
}

export async function getTodaysChunkProgress(userId) {
  //TODO: INDEX userid
  //TODO: CHANGE FOR PERFORMANCE

  const todaysChunks = await fetchTodaysChunks(userId);
  // let todaysChunks = await fetchTodaysChunksFromCache(userId);

  // if (!todaysChunks || todaysChunks.length <= 0) {
  //   console.log("cache empty");
  // const currentExams = await fetchCurrentExams(userId);
  //   todaysChunks = await calculateTodaysChunks(currentExams);
  // } else {
  //   console.log("cache not empty");
  // }
  // console.log("TODAYS CHUNKS");
  // console.log(todaysChunks);
  return calculateChunkProgress(todaysChunks);
}

function calculateChunkProgress(chunks) {
  //TODO: HANDLE Chunk COMPLETED
  let totalDuration = 0;
  let totalDurationCompleted = 0;
  chunks.forEach(chunk => {
    //INDEX USERID FOR TODAYSCHUNKS AND EXAMID FOR EXAMSs
    //TODO: CACHE AND NOT CACHE OBEJECTS SHOULD LOOK THE SAME SO DON'T HAVE ALL THIS:
    // console.log(chunk);
    totalDuration += chunk.durationToday;

    totalDurationCompleted += durationCompleted({
      duration: chunk.durationToday,
      startPage: chunk.startPage,
      currentPage: chunk.currentPage,
      numberPages: chunk.numberPagesToday
    });
    console.log(".........");
    console.log("durationToday:" + chunk.durationToday);
    console.log("startPage:" + chunk.startPage); //16

    console.log("currentPage:" + chunk.currentPage);
    console.log("numberPagesToday:" + chunk.numberPagesToday);
  });

  console.log("-----------");
  console.log("totalDuration:" + totalDuration);
  console.log("totalDurationCompleted:" + totalDurationCompleted);

  //duration ..... 100%
  //duration completed ... x
  if (totalDuration === 0) return 0;
  return Math.round((100 / totalDuration) * totalDurationCompleted);
}

export function durationCompleted({
  duration,
  startPage,
  currentPage,
  numberPages
}) {
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

//---------------------------HELPERS---------------------------

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
