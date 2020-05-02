//TODO: EXTRACT ALL DATABASE LOGIC TO APOLLO DATASOURCE: https://www.apollographql.com/docs/tutorial/data-source/
import { Exam, TodaysChunkCache } from "../models";
import { GraphQLScalarType } from "graphql";
import { Kind } from "graphql/language";

import {
  prepareExamInputData,
  verifyExamInput,
  handleCurrentPageInput,
  // fetchTodaysChunks,
  // fetchCalendarChunks,
  handleUpdateExamInput,
  verifyAddExamDates
  // learningIsComplete
} from "../helpers/examHelpers";

import {
  fetchTodaysChunks,
  fetchCalendarChunks,
  getTodaysChunkProgress,
  calculateChunkProgress,
  handleUpdateCurrentPageInTodaysChunkCache,
  handleUpdateExamInTodaysChunkCache
} from "../helpers/chunks";

import { verifyRegexDate } from "../helpers/verifyUserInput";
// import { ApolloError } from "apollo-server";
import {
  handleResolverError,
  handleAuthentication
} from "../helpers/resolvers";
import { ApolloError } from "apollo-server";

//TODO: Authentication
export const examResolvers = {
  Query: {
    exams: async (root, args, context, info) => {
      try {
        //TODO: SORT BY Alphabet
        handleAuthentication(context.userInfo);

        const resp = await Exam.find({
          userId: context.userInfo.userId
        }).sort({ subject: "asc" });
        if (!resp) return [];
        return resp;
      } catch (err) {
        handleResolverError(err);
      }
    },
    exam: async (root, args, context, info) => {
      try {
        handleAuthentication(context.userInfo);

        const resp = await Exam.findOne({
          _id: args.id,
          userId: context.userInfo.userId
        });

        if (!resp) return {};
        return resp;
      } catch (err) {
        handleResolverError(err);
      }
    },
    todaysChunkAndProgress: async (root, args, context, info) => {
      try {
        handleAuthentication(context.userInfo);
        const chunks = await fetchTodaysChunks(context.userInfo.userId);
        const todaysProgress = calculateChunkProgress(chunks);

        //to avoid todayschunks and progress being fetched at the same time
        //TODO: FETCH THE PRGORESS HERE AND RETURN IT

        return { todaysChunks: chunks, todaysProgress };
      } catch (err) {
        handleResolverError(err);
      }
    },
    calendarChunks: async (root, args, context, info) => {
      try {
        handleAuthentication(context.userInfo);
        const chunks = await fetchCalendarChunks(context.userInfo.userId);
        return chunks;
      } catch (err) {
        handleResolverError(err);
      }
    },
    examsCount: async (root, args, context, info) => {
      try {
        handleAuthentication(context.userInfo);
        const currentExams = await Exam.countDocuments({
          userId: context.userInfo.userId,
          completed: false
        });
        const finishedExams = await Exam.countDocuments({
          userId: context.userInfo.userId,
          completed: true
        });

        //TODO: ERROR HANDLING?
        return { currentExams, finishedExams };
      } catch (err) {
        handleResolverError(err);
      }
    },
    todaysChunksProgress: async (parent, args, context) => {
      try {
        // console.log("IN QUERY TODAYS CHUNKS PROGRESS");
        //TODO - REFACTOR SO NOT ITERATING THROUGH 2 TIMES
        handleAuthentication(context.userInfo);

        return await getTodaysChunkProgress(context.userInfo.userId);
        // return calculateUserState(chunks);
        // returnVAlues: "VERY_HAPPY", "HAPPY", "OKAY", "STRESSED", "VERY_STRESSED"
        // return "VERY_HAPPY";
      } catch (err) {
        handleResolverError(err);
      }
    }
  },
  Mutation: {
    addExam: async (root, args, context, info) => {
      try {
        handleAuthentication(context.userInfo);
        verifyExamInput(args, context.userInfo.userId);
        verifyAddExamDates(args.startDate, args.examDate);
        const processedArgs = prepareExamInputData(
          { ...args },
          context.userInfo.userId
        );
        console.log(processedArgs);
        await Exam.create(processedArgs);
      } catch (err) {
        handleResolverError(err);
      }
      return true;
    },
    updateExam: async (root, args, context, info) => {
      try {
        handleAuthentication(context.userInfo);
        // console.log("IN UPDATE EXAM MUTAION");
        const exam = await Exam.findOne({
          _id: args.id,
          userId: context.userInfo.userId
        });
        if (!exam)
          throw new ApolloError(
            "No exam exists with this exam id: " + args.id + " for this user."
          );
        const processedArgs = await handleUpdateExamInput(
          exam,
          args,
          context.userInfo.userId
        );

        const resp = await Exam.updateOne(
          { _id: args.id, userId: context.userInfo.userId },
          { ...processedArgs }
        );
        if (resp.ok === 0 || resp.nModified === 0)
          throw new ApolloError("The exam couldn't be updated.");

        //TODO - NEED AWAIT HERE?
        await handleUpdateExamInTodaysChunkCache(
          context.userInfo.userId,
          exam,
          processedArgs
        );
        const updatedExam = await Exam.findOne({
          _id: args.id,
          userId: context.userInfo.userId
        });

        return updatedExam;
      } catch (err) {
        handleResolverError(err);
      }
    },
    updateCurrentPage: async (root, args, context, info) => {
      //TODO: CHECK IF COMPLETED EXAM - IF SO CHANGE IT
      //TODO: SHOULD I ALSO CHANGE THE TODAYS CHUNK CURRENT PAGE?
      try {
        handleAuthentication(context.userInfo);
        const exam = await handleCurrentPageInput(
          args.page,
          args.examId,
          context.userInfo.userId
        );
        if (exam.currentPage === args.page) return true;

        // console.log("hi");
        // console.log(exam.completed);
        const resp = await Exam.updateOne(
          { _id: args.examId, userId: context.userInfo.userId },
          {
            currentPage: args.page,
            completed: exam.completed,
            updatedAt: new Date()
          }
        );

        if (resp.ok !== 1 || resp.nModified !== 1)
          throw new ApolloError("The current page couldn't be updated.");

        //TODO - NEED AWAIT HERE?
        await handleUpdateCurrentPageInTodaysChunkCache(
          context.userInfo.userId,
          exam._id,
          args.page
        );

        return true;
      } catch (err) {
        handleResolverError(err);
      }
    },
    examCompleted: async (root, args, context, info) => {
      try {
        // console.log(await Exam.find({ userId: context.userInfo.userId }));
        handleAuthentication(context.userInfo);

        const exam = await Exam.findOne({
          _id: args.id,
          userId: context.userInfo.userId
        });
        if (!exam)
          throw new ApolloError(
            "There is no exam with the id: " + args.id + " for that user."
          );
        const resp = await Exam.updateOne(
          { _id: args.id },
          { completed: true }
        );
        if (resp.ok === 0 || resp.nModified === 0)
          throw new ApolloError("The exam couldn't be updated.");
        const respUpdateTodaysChunkCache = await TodaysChunkCache.updateOne(
          { examId: args.id },
          { completed: true }
        );
        if (
          respUpdateTodaysChunkCache.ok === 0 ||
          respUpdateTodaysChunkCache.nModified === 0
        )
          throw new ApolloError("The chunk cache couldn't be updated.");
        return true;
      } catch (err) {
        handleResolverError(err);
      }
    },
    deleteExam: async (root, args, context, info) => {
      //TODO: CHECK IF COMPLETED EXAM - IF SO CHANGE IT
      try {
        handleAuthentication(context.userInfo);
        //TODO ASK - WHETHER TO CHECK FIRST IF EXAM EXISTS
        const exam = await Exam.findOne({
          _id: args.id,
          userId: context.userInfo.userId
        });
        if (!exam)
          throw new ApolloError(
            "No exam exists with this exam id: " + args.id + " for this user."
          );
        const resp = await Exam.deleteOne({
          _id: args.id,
          userId: context.userInfo.userId
        });

        const todaysChunkCacheNumber = await TodaysChunkCache.countDocuments({
          examId: args.id,
          userId: context.userInfo.userId
        });
        if (todaysChunkCacheNumber === 1) {
          const respDeleteChunkCache = await TodaysChunkCache.deleteOne({
            examId: args.id,
            userId: context.userInfo.userId
          });
          if (
            respDeleteChunkCache.ok !== 1 ||
            respDeleteChunkCache.deletedCount !== 1
          )
            throw new ApolloError(
              "The exam today's chunk cache couldn't be deleted"
            );
        }

        // console.log(resp);
        if (resp.ok !== 1 || resp.deletedCount !== 1)
          throw new ApolloError("The exam couldn't be deleted");
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
