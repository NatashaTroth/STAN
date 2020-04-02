//TODO: EXTRACT ALL DATABASE LOGIC TO APOLLO DATASOURCE: https://www.apollographql.com/docs/tutorial/data-source/
const { Exam } = require("../models");
const { GraphQLScalarType } = require("graphql");
const { Kind } = require("graphql/language");
// const dayjs = require("dayjs");
// import mongoose from "mongoose";
// const { ObjectId } = require("mongodb");
// const ObjectID = require("mongodb").ObjectID;

import {
  datesTimingIsValid,
  startDateIsActive,
  numberOfDaysLeft
} from "../helpers/dates";
import { verifyUserInputFormat } from "../helpers/examHelpers";
import { numberOfPagesForChunk } from "../helpers/chunks";
// const { verifyExamDate } = require("../helpers/verifyUserInput");
const { AuthenticationError, ApolloError } = require("apollo-server");

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

        console.log(exams);
        const currentExams = exams.filter(exam => {
          // return true;
          return startDateIsActive(new Date(exam.startDate));
        });
        console.log("In TODAYSCHUNKS");
        const chunks = currentExams.map(exam => {
          const numberPages = numberOfPagesForChunk({
            numberOfPages: exam.numberPages,
            currentPage: exam.currentPage,
            daysLeft: numberOfDaysLeft(exam.startDate, exam.examDate)
          });
          const duration =
            exam.timePerPage > 0 ? exam.timePerPage * numberPages : null;
          return {
            examId: exam.id,
            subject: exam.subject,
            numberPages,
            duration
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
        console.log(args.examDate);
        verifyUserInputFormat(args);
        if (!args.startDate || args.startDate.length <= 0) {
          args.startDate = new Date();
        }

        console.log("in if");
        args.examDate = new Date(args.examDate);
        if (!datesTimingIsValid(args.startDate, args.examDate))
          throw new ApolloError(
            "Dates cannot be in the past and start learning date must be before exam date."
          );
        args.userId = context.userInfo.userId;
        args.currentPage = args.startPage;
        const resp = await Exam.create({
          subject: args.subject,
          examDate: args.examDate,
          startDate: args.startDate,
          numberPages: args.numberPages,
          timePerPage: args.timePerPage || -1,
          timesRepeat: args.timesRepeat || 1,
          currentPage: args.currentPage || 0,
          notes: args.notes,
          pdfLink: args.pdfLink,
          completed: args.completed || false,
          userId: args.userId
        });
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
      console.log("in parse date");
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
