//TODO CHANGE ORDER of all the functions
// import { ApolloError } from "apollo-server";
import { Exam, TodaysChunkCache } from "../../models";

import { startDateIsActive, getNumberOfDays, isTheSameDay } from "../dates";

import {
  learningIsComplete
  // handleCurrentPageInput
} from "./examHelpers";
import { ApolloError } from "apollo-server";
import { numberOfPagesForChunk, calcPagesLeft, durationLeft } from "./chunkHelpers";

export async function fetchTodaysChunks(userId) {
  // console.log("in FETCHChunkFunc");
  const currentExams = await fetchCurrentExams(userId);
  let chunks;
  let todaysChunksFromCache = await TodaysChunkCache.find({ userId });

  if (!todaysChunksFromCache || todaysChunksFromCache.length <= 0) {
    // console.log("cache empty");
    chunks = await calculateTodaysChunks(currentExams);
  } else {
    // console.log("cache not empty");
    chunks = await createTodaysChunksFromCache(currentExams, todaysChunksFromCache);
  }

  return chunks;
}

async function createTodaysChunksFromCache(currentExams, todaysChunks) {
  const chunks = currentExams.map(async exam => {
    let chunk = todaysChunks.find(chunk => chunk.examId === exam.id);

    //cache calculated from scratch
    if (!chunk || !chunkCacheIsValid(chunk.updatedAt, exam.updatedAt)) {
      // console.log("invalid cache");

      const newChunk = createTodaysChunkObject(exam);
      if (!chunk) {
        // console.log("no chunk - recalc");
        await addTodaysChunkToDatabase(newChunk, exam.userId);
      } else {
        // console.log("updating chunk with updates");
        // console.log(newChunk);
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
      durationAlreadyLearned: chunk.durationAlreadyLearned,
      durationLeftToday,
      daysLeft: chunk.daysLeft,
      notEnoughTime: chunk.notEnoughTime,
      completed: chunk.completed
    };
  });
  const resp = await Promise.all(chunks);

  return resp;
}

export function chunkCacheIsValid(chunkUpdatedAt) {
  return isTheSameDay(chunkUpdatedAt, new Date());
  //TODO do i need this? don't think so now
  // && date1IsBeforeDate2(examUpdatedAt, chunkUpdatedAt)
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
  // console.log("cahe was empty, calcing new chunks");
  //remove exams where completed = false, but learning is finished
  const exams = currentExams.filter(
    exam =>
      !learningIsComplete(exam.currentPage, exam.startPage, exam.numberPages, exam.timesRepeat)
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
    durationAlreadyLearned: 0,
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
