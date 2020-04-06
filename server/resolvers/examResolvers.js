//TODO: EXTRACT ALL DATABASE LOGIC TO APOLLO DATASOURCE: https://www.apollographql.com/docs/tutorial/data-source/
import { Exam } from "../models";
import { GraphQLScalarType } from "graphql";
import { Kind } from "graphql/language";

import {
  datesTimingIsValid,
  startDateIsActive,
  getNumberOfDays
} from "../helpers/dates";
import {
  prepareExamInputData,
  verifyExamInput,
  handleCurrentPageInput
} from "../helpers/examHelpers";
import { deepCopyObject } from "../helpers/generalFunctions";
import { numberOfPagesForChunk } from "../helpers/chunks";

import { ApolloError } from "apollo-server";
import {
  handleResolverError,
  handleAuthentication
} from "../helpers/resolvers";

//TODO: Authentication
const examResolvers = {
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
        // fetchCurrentExams(context.userInfo.userId)
        const exams = await Exam.find({
          userId: context.userInfo.userId,
          completed: false
        });

        const currentExams = exams.filter(exam => {
          // return true;
          return startDateIsActive(new Date(exam.startDate));
        });

        const chunks = currentExams.map(exam => {
          const daysLeft = getNumberOfDays(new Date(), exam.examDate);
          const numberPagesToday = numberOfPagesForChunk({
            numberOfPages: exam.numberPages,
            currentPage: exam.currentPage,
            daysLeft,
            repeat: exam.timesRepeat
          });
          const duration =
            exam.timePerPage > 0 ? exam.timePerPage * numberPagesToday : null;
          return {
            exam,
            numberPagesToday,
            duration,
            daysLeft,
            totalNumberDays: getNumberOfDays(exam.startDate, exam.examDate),
            // totalChunks: getNumberOfDays(exam.startDate, exam.examDate),
            numberPagesWithRepeat: exam.numberPages * exam.timesRepeat,
            notEnoughTime: false //TODO: IMPLEMENT
          };
        });
        // {
        //   subject: String!
        //   numberPages: Int!
        //   duration: Int!
        // // }
        return chunks;

        // filter out where start date is in the past
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

//TODO: refactor??

module.exports = {
  examResolvers
};
