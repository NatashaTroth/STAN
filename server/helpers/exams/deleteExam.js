//TODO: EXTRACT ALL DATABASE LOGIC TO APOLLO DATASOURCE: https://www.apollographql.com/docs/tutorial/data-source/
import { Exam } from "../../models";
import { fetchExam } from "./examHelpers";
import { deleteExamsTodaysCache } from "./chunks";
import { ApolloError } from "apollo-server";

export async function handleDeleteExam(args, userInfo) {
  //TODO need?
  await fetchExam(args.id, userInfo.userId);

  const resp = await Exam.deleteOne({
    _id: args.id,
    userId: userInfo.userId
  });

  if (resp.ok !== 1 || resp.deletedCount !== 1)
    throw new ApolloError("The exam couldn't be deleted");

  await deleteExamsTodaysCache(userInfo.userId, args.id);
}
