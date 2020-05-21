//TODO: EXTRACT ALL DATABASE LOGIC TO APOLLO DATASOURCE: https://www.apollographql.com/docs/tutorial/data-source/
import { Exam } from "../../models";
import { handleUpdateExamInput, fetchExam } from "./examHelpers";
import { handleUpdateExamInTodaysChunkCache } from "./chunks";
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
