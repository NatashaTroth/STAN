//TODO: EXTRACT ALL DATABASE LOGIC TO APOLLO DATASOURCE: https://www.apollographql.com/docs/tutorial/data-source/
const { Exam, User } = require("../models");
const { GraphQLScalarType } = require("graphql");
const { Kind } = require("graphql/language");
const dayjs = require("dayjs");
import mongoose from "mongoose";
// const { ObjectId } = require("mongodb");
// const ObjectID = require("mongodb").ObjectID;

const {
  UserInputError,
  AuthenticationError,
  ApolloError
} = require("apollo-server");
const {
  verifySubject,
  verifyExamDate,
  verifyStudyStartDate,
  verifyPageAmount,
  verifyPageTime,
  verifyPageRepeat,
  verifyCurrentPage,
  verifyPageNotes
} = require("../helpers/verifyUserInput");
// const { JsonWebTokenError } = require("jsonwebtoken");
// import { Exam } from "../models";
// import { GraphQLScalarType } from "graphql";
// import { Kind } from "graphql/language";
// import dayjs from "dayjs";
// import {
//   UserInputError,
//   AuthenticationError,
//   ApolloError
// } from "apollo-server";
// import {
//   verifySubject,
//   verifyExamDate,
//   verifyStudyStartDate,
//   verifyPageAmount,
//   verifyPageTime,
//   verifyPageRepeat,
//   verifyCurrentPage,
//   verifyPageNotes
// } from "../helpers/verifyUserInput";
// import { JsonWebTokenError } from "jsonwebtoken";

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
    }
  },
  Mutation: {
    addExam: async (root, args, context) => {
      if (!context.userInfo.isAuth) throw new Error("Unauthorised");
      try {
        verifyUserInputFormat(args);
        // if (!args.userId) args.userId = context.userInfo.userId;
        // else if (args.userId !== context.userInfo.userId)
        //   throw new AuthenticationError(
        //     "Not authorised to create an exam for the this user."
        //   );
        args.userId = context.userInfo.userId;
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
      if (!value) return dayjs(new Date());
      return dayjs(value); // value from the client
    },
    serialize(value) {
      return dayjs(value).format("MM-DD-YYYY"); // value sent to the client
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.STRING) {
        return dayjs(ast.value); // ast value is always in string format
      }
      return null;
    }
  })
};

function verifyUserInputFormat({
  subject,
  examDate,
  startDate,
  numberPages,
  timePerPage,
  timesRepeat,
  currentPage,
  notes
  // pdfLink,
  // completed,
  // userId
}) {
  let examOnlyDate = new Date(examDate).toLocaleDateString();
  let startOnlyDate = "";
  if (startDate) startOnlyDate = new Date(startDate).toLocaleDateString();

  //TODO: MAKE SURE CHECKED EVERYTHING THAT CAN BE NULL
  if (typeof subject !== "undefined" && !verifySubject(subject))
    throw new AuthenticationError("Subject input has the wrong format");

  if (typeof examDate !== "undefined" && !verifyExamDate(examOnlyDate))
    throw new AuthenticationError("Exam date input has the wrong format");

  if (
    typeof startDate !== "undefined" &&
    startDate != null &&
    !verifyStudyStartDate(startOnlyDate)
  )
    throw new AuthenticationError(
      "Study start date input has the wrong format"
    );

  if (
    typeof numberPages !== "undefined" &&
    !verifyPageAmount(numberPages.toString())
  )
    throw new AuthenticationError("Number of pages input has the wrong format");

  if (
    typeof timePerPage !== "undefined" &&
    timePerPage != null &&
    !verifyPageTime(timePerPage.toString())
  )
    throw new AuthenticationError("Time per page input has the wrong format");

  if (
    typeof timesRepeat !== "undefined" &&
    timesRepeat != null &&
    !verifyPageRepeat(timesRepeat.toString())
  )
    throw new AuthenticationError("Times to repeat input has the wrong format");

  if (
    typeof currentPage !== "undefined" &&
    currentPage != null &&
    !verifyCurrentPage(currentPage.toString())
  )
    throw new AuthenticationError("Current page input has the wrong format");

  if (typeof notes !== "undefined" && notes != null && !verifyPageNotes(notes))
    throw new AuthenticationError("Notes input has the wrong format");
}

module.exports = {
  examResolvers
};
