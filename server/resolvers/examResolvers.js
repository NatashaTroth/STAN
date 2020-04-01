//TODO: EXTRACT ALL DATABASE LOGIC TO APOLLO DATASOURCE: https://www.apollographql.com/docs/tutorial/data-source/
const { Exam, User } = require("../models");
const { GraphQLScalarType } = require("graphql");
const { Kind } = require("graphql/language");
const dayjs = require("dayjs");
import mongoose from "mongoose";
// const { ObjectId } = require("mongodb");
// const ObjectID = require("mongodb").ObjectID;
import { datesTimingIsValid, startDateIsActive } from "../helpers/dates";
import { verifyUserInputFormat } from "../helpers/examHelpers";
import { numberOfPagesForChunk } from "../helpers/chunks";
const {
  verifyExamDate,
  numberOfDaysLeft
} = require("../helpers/verifyUserInput");
const {
  UserInputError,
  AuthenticationError,
  ApolloError
} = require("apollo-server");

// const { JsonWebTokenError } = require("jsonwebtoken");

//TODO: Authentication
const examResolvers = {
  Query: {
    exams: async (root, args, context, info) => {
      try {
        if (!context.userInfo.isAuth) throw new Error("Unauthorised");
        const resp = await Exam.find({
          userId: context.userInfo.userId
        });

        return resp;
      } catch (err) {
        if (
          err.extensions &&
          err.extensions.code &&
          err.extensions.code !== "UNAUTHENTICATED"
        )
          throw new AuthenticationError(err.message);
        throw err;
      }
    },
    exam: async (root, args, context, info) => {
      try {
        if (!context.userInfo.isAuth) throw new Error("Unauthorised");
        const resp = await Exam.findOne({
          _id: args.id,
          userId: context.userInfo.userId
        });

        return resp;
      } catch (err) {
        if (
          err.extensions &&
          err.extensions.code &&
          err.extensions.code !== "UNAUTHENTICATED"
        )
          throw new AuthenticationError(err.message);
        throw err;
      }
    },
    todaysChunks: async (root, args, context, info) => {
      try {
        if (!context.userInfo.isAuth) throw new Error("Unauthorised");
        //fetch exams from userid that are not completed
        const exams = await Exam.find({
          userId: context.userInfo.userId,
          completed: false
        });

        const currentExams = exams.filter(exam => {
          // return true;
          return startDateIsActive(new Date(exam.startDate));
        });
        console.log("In TODAYSCHUNKS");
        console.log(currentExams);
        const chunks = currentExams.map(exam => {
          return {
            subject: exam.subject,
            numberPages: numberOfPagesForChunk({
              numberOfPages: exam.numberOfPages,
              currentPage: exam.numberOfPages,
              daysLeft: numberOfDaysLeft(exam.startDate, exam.examDate)
            }),
            duration: 5
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
        if (
          err.extensions &&
          err.extensions.code &&
          err.extensions.code !== "UNAUTHENTICATED"
        )
          throw new AuthenticationError(err.message);
        throw err;
      }
    }
  },
  Mutation: {
    addExam: async (root, args, context, info) => {
      if (!context.userInfo.isAuth) throw new Error("Unauthorised");
      try {
        verifyUserInputFormat(args);
        if (!args.startDate || args.startDate.length <= 0) {
          args.startDate = new Date();
        }

        args.examDate = new Date(args.examDate);
        if (!datesTimingIsValid(args.startDate, args.examDate))
          throw new ApolloError(
            "Dates cannot be in the past and start learning date must be before exam date."
          );
        args.userId = context.userInfo.userId;
        args.currentPage = args.startPage;
        const resp = await Exam.create(args);
        if (!resp) throw new ApolloError("Unable to add exam.");
      } catch (err) {
        if (
          err.extensions &&
          err.extensions.code &&
          err.extensions.code !== "UNAUTHENTICATED"
        )
          throw new ApolloError(err.message);
        throw err;
      }
      return true;
    }
  },
  Date: new GraphQLScalarType({
    name: "Date",
    description: "Custom description for the date scalar",
    parseValue(value) {
      //TODO: not sure if this is good for examDate
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
