import { Exam, TodaysChunkCache } from "../../models";
import { handleUpdateExamInput, fetchExam, learningIsComplete } from "./examHelpers";
import { createTodaysChunkObject } from "./todaysChunks";
import { todaysChunkIsCompleted } from "./chunks";
import { ApolloError } from "apollo-server";
import { isTheSameDay } from "../dates";

export async function handleUpdateCurrentPage(args, userInfo) {
  const exam = await handleCurrentPageInput(args.page, args.id, userInfo.userId);
  if (exam.currentPage === args.page) return true;

  const resp = await Exam.updateOne(
    { _id: args.id, userId: userInfo.userId },
    {
      currentPage: args.page,
      // completed: exam.completed,
      updatedAt: new Date()
    }
  );

  if (resp.ok !== 1 || resp.nModified !== 1)
    throw new ApolloError("The current page couldn't be updated.");

  //TODO - don't think need anymore
  // if (exam.completed)
  //   await deleteExamsTodaysCache(userInfo.userId, exam._id);
  // else
  await handleUpdateCurrentPageInTodaysChunkCache(userInfo.userId, exam._id, args.page);
}

export async function handleCurrentPageInput(page, examId, userId) {
  const exam = await Exam.findOne({
    _id: examId,
    userId: userId
  });
  if (!exam) throw new ApolloError("There is no exam with the id: " + examId + " for that user.");
  if (page < exam.startPage)
    throw new ApolloError("The entered current page is lower than the start page for this exam.");
  if (page > exam.numberPages * exam.timesRepeat + exam.startPage)
    throw new ApolloError(
      "The entered current page is higher than the number of pages for this exam."
    );

  // console.log("checking exam learning complete not chunk");
  exam.completed = learningIsComplete(page, exam.startPage, exam.numberPages, exam.timesRepeat);

  return exam;
}

export async function handleUpdateCurrentPageInTodaysChunkCache(userId, examId, page) {
  // console.log("updateCurrChunkPageFunk  ");
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
      completed,
      updatedAt: new Date()
    }
  );

  if (updateCacheResp.ok !== 1 || updateCacheResp.nModified !== 1)
    throw new ApolloError("The todays chunk cache current page could not be updated.");
  // console.log("updateCurrChunkPageFunk  - updated page");
}
