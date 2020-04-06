//TODO: EXTRACT ALL DATABASE LOGIC TO APOLLO DATASOURCE: https://www.apollographql.com/docs/tutorial/data-source/
import { Exam } from "../models";
import { GraphQLScalarType } from "graphql";
import { Kind } from "graphql/language";

import {
  prepareExamInputData,
  verifyExamInput,
  handleCurrentPageInput,
  fetchTodaysChunks
} from "../helpers/examHelpers";

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
        handleAuthentication(context.userInfo);

        return await Exam.find({
          userId: context.userInfo.userId
        });
      } catch (err) {
        handleResolverError(err);
      }
    },
    exam: async (root, args, context, info) => {
      try {
        handleAuthentication(context.userInfo);

        return await Exam.findOne({
          _id: args.id,
          userId: context.userInfo.userId
        });
      } catch (err) {
        handleResolverError(err);
      }
    },
    todaysChunks: async (root, args, context, info) => {
      try {
        handleAuthentication(context.userInfo);
        return await fetchTodaysChunks(context.userInfo.userId);
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
          context.userInfo
        );
        await Exam.create(processedArgs);
      } catch (err) {
        handleResolverError(err);
      }
      return true;
    },
    updateCurrentPage: async (root, args, context, info) => {
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
    description: "Custom description for the date scalar",
    parseValue(value) {
      //TODO: not sure if this is good for examDate
      // console.log("in parse date");
      if (!value || value.length <= 0) return new Date();
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
