//TODO: EXTRACT ALL DATABASE LOGIC TO APOLLO DATASOURCE: https://www.apollographql.com/docs/tutorial/data-source/
import { Exam } from "../models";
import { GraphQLScalarType } from "graphql";
import { Kind } from "graphql/language";

import {
  prepareExamInputData,
  verifyExamInput,
  handleCurrentPageInput,
  fetchTodaysChunks,
  fetchCalendarChunks
} from "../helpers/examHelpers";

import { verifyRegexDate } from "../helpers/verifyUserInput";
// import { ApolloError } from "apollo-server";
import {
  handleResolverError,
  handleAuthentication
} from "../helpers/resolvers";

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
    todaysChunks: async (root, args, context, info) => {
      try {
        //TODO: SORTBY EXAM DATE
        handleAuthentication(context.userInfo);
        const chunks = await fetchTodaysChunks(context.userInfo.userId);
        // console.log(chunks);
        return chunks;
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
    }
  },
  Mutation: {
    addExam: async (root, args, context, info) => {
      try {
        handleAuthentication(context.userInfo);
        verifyExamInput(args, context.userInfo.userId);
        const processedArgs = prepareExamInputData(
          { ...args },
          context.userInfo.userId
        );
        await Exam.create(processedArgs);
      } catch (err) {
        handleResolverError(err);
      }
      return true;
    },
    updateCurrentPage: async (root, args, context, info) => {
      //TODO: CHECK IF COMPLETED EXAM - IF SO CHANGE IT
      try {
        handleAuthentication(context.userInfo);
        const exam = await handleCurrentPageInput(
          args.page,
          args.examId,
          context.userInfo.userId
        );
        if (exam.currentPage === args.page) return true;

        const resp = await Exam.updateOne(
          { _id: args.examId },
          { currentPage: args.page }
        );

        if (resp.nModified === 0) return false;
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
