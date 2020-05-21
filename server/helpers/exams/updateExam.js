import { Exam, TodaysChunkCache } from "../../models";
import { handleUpdateExamInput, fetchExam, learningIsComplete } from "./examHelpers";
import { createTodaysChunkObject } from "./todaysChunks";
import { calcPagesLeft, todaysChunkIsCompleted } from "./chunks";
import { ApolloError } from "apollo-server";
import { isTheSameDay } from "../dates";

export async function handleUpdateExam(args, userInfo) {
  // console.log("IN UPDATE EXAM MUTAION");
  const exam = await fetchExam(args.id, userInfo.userId);

  const processedArgs = await handleUpdateExamInput(exam, args, userInfo.userId);

  const resp = await Exam.updateOne(
    { _id: args.id, userId: userInfo.userId },
    { ...processedArgs, updatedAt: new Date() }
  );

  if (resp.ok === 0 || resp.nModified === 0) throw new ApolloError("The exam couldn't be updated.");

  //TODO: DON'T THINK I NEED, SINCE DELETED NEXT DAY
  // if (processedArgs.completed)
  //   await deleteExamsTodaysCache(userInfo.userId, exam._id);
  // //TODO - NEED AWAIT HERE?
  // else
  await handleUpdateExamInTodaysChunkCache(userInfo.userId, exam, processedArgs);
  return fetchExam(args.id, userInfo.userId);
}

async function handleUpdateExamInTodaysChunkCache(userId, exam, newArgs) {
  // console.log("in handleUpdateExamInTodaysChunkCache");
  const todaysChunkCache = await TodaysChunkCache.findOne({
    examId: exam._id.toString(),
    userId
  });

  if (!todaysChunkCache) return;

  if (chunkHasToBeChanged(exam, newArgs)) {
    // console.log("chunk has to be changed");

    const updates = filterOutUpdatesInTodaysChunk(exam, newArgs, todaysChunkCache);
    //TODO EXTRAct
    const updateCacheResp = await TodaysChunkCache.updateOne(
      {
        examId: exam._id.toString(),
        userId
      },
      {
        ...updates,
        updatedAt: new Date()
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
      updates.durationToday = todaysChunkCache.numberPagesToday * newArgs.timePerPage;
      updateNeeded = true;
    }
    updates.completed = todaysChunkIsCompleted(newArgs.currentPage, todaysChunkCache);

    if (updateNeeded) {
      // console.log("update was needed");
      //TODO EXTRAct

      const updateCacheResp = await TodaysChunkCache.updateOne(
        {
          examId: exam._id.toString(),
          userId
        },
        {
          ...updates,
          updatedAt: new Date()
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

function filterOutUpdatesInTodaysChunk(exam, newArgs, oldChunk) {
  let updates;
  const newChunk = createTodaysChunkObject(newArgs);
  const durationAlreadyLearned = calcCompletedDuration(oldChunk) + oldChunk.durationAlreadyLearned;

  const totalDurationLeft =
    calcPagesLeft(
      newChunk.exam.numberPages,
      newChunk.exam.timesRepeat,
      newChunk.exam.startPage,
      newChunk.exam.currentPage
    ) * newChunk.exam.timePerPage;
  // console.log(
  //   "pages left " +
  //     calcPagesLeft(
  //       newChunk.exam.numberPages,
  //       newChunk.exam.timesRepeat,
  //       newChunk.exam.startPage,
  //       newChunk.exam.currentPage
  //     )
  // );
  // console.log("totalDurationLeft " + totalDurationLeft);
  const dailyDurationWithCompletedDuration =
    (totalDurationLeft + durationAlreadyLearned) / newChunk.daysLeft;
  // console.log(
  //   "dailyDurationWithCompletedDuration " + dailyDurationWithCompletedDuration
  // );

  let durationToday = Math.ceil(dailyDurationWithCompletedDuration - durationAlreadyLearned);

  if (durationToday < 0) durationToday = 0;
  // console.log("durationToday " + durationToday);

  const numberPagesToday = Math.ceil(durationToday / newChunk.exam.timePerPage);
  // console.log("numberPagesToday " + numberPagesToday);

  durationToday = numberPagesToday * newChunk.exam.timePerPage;
  // console.log("durationToday " + durationToday);

  updates = {
    numberPagesToday,
    durationToday,
    startPage: newChunk.currentPage,
    currentPage: newChunk.currentPage,
    daysLeft: newChunk.daysLeft,
    notEnoughTime: newChunk.notEnoughTime,
    durationAlreadyLearned,
    completed: newChunk.completed
    // updatedAt: new Date
  };

  return updates;
}

function calcCompletedDuration(chunk) {
  const timePerPage = chunk.durationToday / chunk.numberPagesToday;
  const numberOfCompletedPages = chunk.currentPage - chunk.startPage;

  return timePerPage * numberOfCompletedPages;
}
