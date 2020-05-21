//TODO: EXTRACT ALL DATABASE LOGIC TO APOLLO DATASOURCE: https://www.apollographql.com/docs/tutorial/data-source/
import { Exam } from "../models";
import { GraphQLScalarType } from "graphql";
import { Kind } from "graphql/language";

import {
  escapeExamObject,
  escapeExamObjects,
  escapeTodaysChunksObjects,
  escapeCalendarObjects,
  fetchExam
} from "../helpers/exams/examHelpers";

import {
  fetchTodaysChunks,
  fetchCalendarChunks,
  calculateChunkProgress,
  deleteExamsTodaysCache
} from "../helpers/exams/chunks";

import { verifyRegexDate } from "../helpers/verifyInput";

import { handleResolverError, handleAuthentication } from "../helpers/generalHelpers";
import { ApolloError } from "apollo-server";
import { handleAddExam } from "../helpers/exams/addExam";
import { handleUpdateExam, handleUpdateCurrentPage } from "../helpers/exams/updateExam";
import { handleExamCompleted } from "../helpers/exams/examCompleted";

//TODO: Authentication
export const examResolvers = {
  Query: {
    exams: async (_, __, { userInfo }) => {
      try {
        handleAuthentication(userInfo);
        const resp = await Exam.find({
          userId: userInfo.userId
        }).sort({ subject: "asc" });
        if (!resp) return [];
        return escapeExamObjects(resp);
      } catch (err) {
        handleResolverError(err);
      }
    },
    exam: async (_, args, { userInfo }) => {
      try {
        handleAuthentication(userInfo);
        const resp = await Exam.findOne({
          _id: args.id,
          userId: userInfo.userId
        });
        if (!resp) throw new ApolloError("This exam does not exist.");
        return escapeExamObject(resp);
      } catch (err) {
        handleResolverError(err);
      }
    },
    todaysChunkAndProgress: async (_, __, { userInfo }) => {
      console.log("IN TODAYS CHUNK PROGRESS");
      try {
        handleAuthentication(userInfo);

        const chunks = await fetchTodaysChunks(userInfo.userId);

        const todaysProgress = calculateChunkProgress(chunks);

        //to avoid todayschunks and progress being fetched at the same time
        //TODO: FETCH THE PRGORESS HERE AND RETURN IT
        const escapedChunks = escapeTodaysChunksObjects(chunks);
        return { todaysChunks: escapedChunks, todaysProgress };
      } catch (err) {
        handleResolverError(err);
      }
    },
    calendarChunks: async (_, __, { userInfo }) => {
      // console.log("IN CALENDAR CHUNKS");
      try {
        handleAuthentication(userInfo);

        const chunks = await fetchCalendarChunks(userInfo.userId);

        return {
          calendarChunks: escapeCalendarObjects(chunks.calendarChunks),
          calendarExams: escapeCalendarObjects(chunks.calendarExams)
        };
      } catch (err) {
        handleResolverError(err);
      }
    },
    examsCount: async (_, __, { userInfo }) => {
      try {
        handleAuthentication(userInfo);
        const currentExams = await Exam.countDocuments({
          userId: userInfo.userId,
          completed: false
        });
        const finishedExams = await Exam.countDocuments({
          userId: userInfo.userId,
          completed: true
        });

        //TODO: ERROR HANDLING?
        return { currentExams, finishedExams };
      } catch (err) {
        handleResolverError(err);
      }
    }
  },
  Mutation: {
    addExam: async (_, args, { userInfo }) => {
      try {
        handleAuthentication(userInfo);
        await handleAddExam(args, userInfo);
        return true;
      } catch (err) {
        handleResolverError(err);
      }
    },
    updateExam: async (_, args, { userInfo }) => {
      try {
        handleAuthentication(userInfo);
        const updatedExam = await handleUpdateExam(args, userInfo);
        return escapeExamObject(updatedExam);
      } catch (err) {
        handleResolverError(err);
      }
    },
    updateCurrentPage: async (_, args, { userInfo }) => {
      try {
        handleAuthentication(userInfo);
        await handleUpdateCurrentPage(args, userInfo);
        return true;
      } catch (err) {
        handleResolverError(err);
      }
    },
    examCompleted: async (_, args, { userInfo }) => {
      try {
        handleAuthentication(userInfo);
        await handleExamCompleted(args, userInfo);

        return true;
      } catch (err) {
        handleResolverError(err);
      }
    },
    deleteExam: async (_, args, { userInfo }) => {
      //TODO: CHECK IF COMPLETED EXAM - IF SO CHANGE IT
      try {
        handleAuthentication(userInfo);
        //TODO need?
        await fetchExam(args.id, userInfo.userId);

        const resp = await Exam.deleteOne({
          _id: args.id,
          userId: userInfo.userId
        });

        // console.log(resp);
        if (resp.ok !== 1 || resp.deletedCount !== 1)
          throw new ApolloError("The exam couldn't be deleted");

        await deleteExamsTodaysCache(userInfo.userId, args.id);

        return true;
      } catch (err) {
        handleResolverError(err);
      }
    }
  },
  Date: new GraphQLScalarType({
    name: "Date",
    description: "GraphqL date scalar",
    parseValue(value) {
      if (value instanceof Date) return value;
      if (
        !value ||
        value.length <= 0 ||
        isNaN(Date.parse(value)) ||
        !verifyRegexDate(value.toString())
      )
        throw new Error(
          "Date input has the wrong format. Valid formats: dd/mm/yyyy, yyyy/mm/dd, mm/dd/yyyy. Valid separators: . / -"
        );
      return new Date(value); // value from the client
    },
    serialize(value) {
      return new Date(value); // value sent to the client
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.STRING) {
        return new Date(ast.value); // ast value is always in string format
      }
      return null;
    }
  })
};
