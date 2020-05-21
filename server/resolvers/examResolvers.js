//TODO: EXTRACT ALL DATABASE LOGIC TO APOLLO DATASOURCE: https://www.apollographql.com/docs/tutorial/data-source/
import { Exam } from "../models";
import { GraphQLScalarType } from "graphql";
import { Kind } from "graphql/language";
import { verifyExamInput, verifyAddExamDates } from "../helpers/exams/validateExamInput";

import {
  prepareExamInputData,
  // verifyExamInput,
  handleCurrentPageInput,
  // fetchTodaysChunks,
  // fetchCalendarChunks,
  handleUpdateExamInput,
  // verifyAddExamDates,
  escapeExamObject,
  escapeExamObjects,
  escapeTodaysChunksObjects,
  escapeCalendarObjects,
  fetchExam
  // learningIsComplete
} from "../helpers/exams/examHelpers";

import {
  fetchTodaysChunks,
  fetchCalendarChunks,
  // getTodaysChunkProgress,
  calculateChunkProgress,
  handleUpdateCurrentPageInTodaysChunkCache,
  handleUpdateExamInTodaysChunkCache,
  deleteExamsTodaysCache
} from "../helpers/exams/chunks";

import { verifyRegexDate } from "../helpers/verifyInput";
// import { ApolloError } from "apollo-server";
import { handleResolverError, handleAuthentication } from "../helpers/generalHelpers";
import { ApolloError } from "apollo-server";

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

        verifyExamInput(args, userInfo.userId);

        verifyAddExamDates(args.startDate, args.examDate);
        const processedArgs = prepareExamInputData({ ...args }, userInfo.userId);

        // console.log(processedArgs);

        await Exam.create(processedArgs);
        //TODO ERROR HANDLING?
      } catch (err) {
        handleResolverError(err);
      }
      return true;
    },
    updateExam: async (_, args, { userInfo }) => {
      try {
        handleAuthentication(userInfo);
        // console.log("IN UPDATE EXAM MUTAION");
        const exam = await fetchExam(args.id, userInfo.userId);

        const processedArgs = await handleUpdateExamInput(exam, args, userInfo.userId);

        const resp = await Exam.updateOne(
          { _id: args.id, userId: userInfo.userId },
          { ...processedArgs, updatedAt: new Date() }
        );

        if (resp.ok === 0 || resp.nModified === 0)
          throw new ApolloError("The exam couldn't be updated.");

        //TODO: DON'T THINK I NEED, SINCE DELETED NEXT DAY
        // if (processedArgs.completed)
        //   await deleteExamsTodaysCache(userInfo.userId, exam._id);
        // //TODO - NEED AWAIT HERE?
        // else
        await handleUpdateExamInTodaysChunkCache(userInfo.userId, exam, processedArgs);
        const updatedExam = await Exam.findOne({
          _id: args.id,
          userId: userInfo.userId
        });

        return escapeExamObject(updatedExam);
      } catch (err) {
        handleResolverError(err);
      }
    },
    updateCurrentPage: async (_, args, { userInfo }) => {
      //TODO: CHECK IF COMPLETED EXAM - IF SO CHANGE IT
      //TODO: SHOULD I ALSO CHANGE THE TODAYS CHUNK CURRENT PAGE?
      // console.log("IN UPDATE CURRENT PAGE RESOLVER");

      try {
        handleAuthentication(userInfo);
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

        return true;
      } catch (err) {
        handleResolverError(err);
      }
    },
    examCompleted: async (_, args, { userInfo }) => {
      try {
        // console.log(await Exam.find({ userId: context.userInfo.userId }));
        handleAuthentication(userInfo);

        // //todo: remove?
        // await fetchExam(args.id, userInfo.userId);

        const resp = await Exam.updateOne(
          { _id: args.id },
          { completed: args.completed, updatedAt: new Date() }
        );

        if (resp.ok === 1 && resp.nModified === 0) return true;
        if (resp.ok === 0) throw new ApolloError("The exam couldn't be updated.");

        await deleteExamsTodaysCache(userInfo.userId, args.id);

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
