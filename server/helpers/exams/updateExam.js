//TODO: EXTRACT ALL DATABASE LOGIC TO APOLLO DATASOURCE: https://www.apollographql.com/docs/tutorial/data-source/
import { Exam } from "../../models";
import { handleUpdateExamInput, fetchExam, learningIsComplete } from "./examHelpers";
import {
  handleUpdateExamInTodaysChunkCache,
  handleUpdateCurrentPageInTodaysChunkCache
} from "./chunks";
import { ApolloError } from "apollo-server";

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
  return await Exam.findOne({
    _id: args.id,
    userId: userInfo.userId
  });
}

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
