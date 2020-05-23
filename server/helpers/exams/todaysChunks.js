import { TodaysChunkCache } from "../../models";
import { startDateIsActive, getNumberOfDays, isTheSameDay, date1IsBeforeDate2 } from "../dates";
import { learningIsComplete, fetchUncompletedExams } from "./examHelpers";

import { numberOfPagesForChunk, durationLeft } from "./chunkHelpers";

export async function fetchTodaysChunks(userId) {
  const currentExams = await fetchCurrentExams(userId);
  let chunks;
  let todaysChunksFromCache = await TodaysChunkCache.find({ userId });
  if (!todaysChunksFromCache || todaysChunksFromCache.length <= 0) {
    chunks = await calculateTodaysChunks(currentExams);
  } else {
    chunks = await createTodaysChunksFromCache(currentExams, todaysChunksFromCache);
  }
  return chunks;
}

async function createTodaysChunksFromCache(currentExams, todaysChunks) {
  const exams = currentExams.filter(
    exam =>
      !isTheSameDay(exam.examDate, new Date()) && date1IsBeforeDate2(new Date(), exam.examDate)
  );

  const chunks = exams.map(async exam => {
    let chunk = todaysChunks.find(chunk => chunk.examId === exam.id);

    //cache calculated from scratch
    if (!chunk || !chunkCacheIsValid(chunk.updatedAt, exam.updatedAt)) {
      // console.log("invalid cache");

      const newChunk = createTodaysChunkObject(exam);
      if (!chunk) {
        await addTodaysChunkToDatabase(newChunk, exam.userId);
      } else {
        newChunk.updatedAt = new Date();
        const resp = await TodaysChunkCache.updateOne(
          { _id: chunk._id },
          { ...newChunk, updatedAt: new Date() }
        );
        if (!resp) throw new Error("Unable to update today's chunk cache.");
      }
      chunk = newChunk;
    }

    const durationLeftToday = durationLeft(
      chunk.startPage,
      chunk.currentPage,
      chunk.numberPagesToday,
      exam.timePerPage
    );
    return {
      exam,
      numberPagesToday: chunk.numberPagesToday,
      startPage: chunk.startPage,
      currentPage: chunk.currentPage,
      durationToday: chunk.durationToday,
      // durationAlreadyLearned: chunk.durationAlreadyLearned,
      durationLeftToday,
      daysLeft: chunk.daysLeft,

      completed: chunk.completed
    };
  });
  const resp = await Promise.all(chunks);

  return resp;
}

export function chunkCacheIsValid(chunkUpdatedAt) {
  return isTheSameDay(chunkUpdatedAt, new Date());
}

async function fetchCurrentExams(userId) {
  const uncompletedExams = await fetchUncompletedExams(userId);
  const currentExams = uncompletedExams.filter(exam => {
    return startDateIsActive(new Date(exam.startDate));
  });
  return currentExams;
}

async function calculateTodaysChunks(currentExams) {
  //remove exams where completed = false, but learning is finished

  const exams = currentExams.filter(
    exam =>
      !learningIsComplete(exam.currentPage, exam.startPage, exam.numberPages, exam.timesRepeat) &&
      !isTheSameDay(exam.examDate, new Date()) &&
      date1IsBeforeDate2(new Date(), exam.examDate)
  );
  const chunks = exams.map(async exam => {
    //if pages are complete, but completed is still false

    const chunk = createTodaysChunkObject(exam);

    await addTodaysChunkToDatabase(chunk, exam.userId);
    return chunk;
  });
  return await Promise.all(chunks);
}

export function createTodaysChunkObject(exam) {
  const daysLeft = getNumberOfDays(new Date(), exam.examDate);
  // if (daysLeft === 0) -> todo
  const numberPagesToday = numberOfPagesForChunk({
    numberOfPages: exam.numberPages,
    startPage: exam.startPage,
    currentPage: exam.currentPage,
    daysLeft,
    repeat: exam.timesRepeat
  });

  //TODO: WHAT IS THIS? - CHECK, DURATION TODAY IS CREATED AS FLOAT SOMEWHERE
  const durationToday = exam.timePerPage > 0 ? exam.timePerPage * numberPagesToday : null;
  // const durationLeftToday = durationLeft(
  //   chunk.startPage,
  //   chunk.currentPage,
  //   chunk.numberPagesToday,
  //   exam.timePerPage
  // );
  const chunk = {
    exam,
    numberPagesToday,
    startPage: exam.currentPage,
    currentPage: exam.currentPage,
    durationToday,
    durationLeftToday: durationToday,
    // durationAlreadyLearned: 0,
    daysLeft,
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
      completed: false
    });
    if (!resp) throw new Error();
  } catch (err) {
    throw new Error("Could not add todays chunk to db. " + err.message);
  }
}
