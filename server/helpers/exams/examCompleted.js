//TODO: EXTRACT ALL DATABASE LOGIC TO APOLLO DATASOURCE: https://www.apollographql.com/docs/tutorial/data-source/
import { Exam } from "../../models";
import { deleteExamsTodaysCache } from "./chunks";
import { ApolloError } from "apollo-server";

export async function handleExamCompleted(args, userInfo) {
  // //todo: remove?
  // await fetchExam(args.id, userInfo.userId);

  const resp = await Exam.updateOne(
    { _id: args.id, userId: userInfo.userId },
    { completed: args.completed, updatedAt: new Date() }
  );

  if (resp.ok === 1 && resp.nModified === 0) return true;
  if (resp.ok === 0) throw new ApolloError("The exam couldn't be updated.");

  await deleteExamsTodaysCache(userInfo.userId, args.id);
}
