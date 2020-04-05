//TODO: EXTRACT ALL DATABASE LOGIC TO APOLLO DATASOURCE: https://www.apollographql.com/docs/tutorial/data-source/
import { Exam } from "../models";
import { GraphQLScalarType } from "graphql";
import { Kind } from "graphql/language";

import {
  datesTimingIsValid,
  startDateIsActive,
  getNumberOfDays
} from "../helpers/dates";
import { verifyUserInputFormat } from "../helpers/examHelpers";
import { numberOfPagesForChunk } from "../helpers/chunks";

import { ApolloError } from "apollo-server";
import { handleResolverError } from "../helpers/errorHandling";

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
        handleResolverError(err);
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
        handleResolverError(err);
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

        // console.log(exams);
        const currentExams = exams.filter(exam => {
          // return true;
          return startDateIsActive(new Date(exam.startDate));
        });
        console.log("In TODAYSCHUNKS");
        console.log();
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

        //TODO MOVE TO VERIFY USER INPUT
        if (args.timePerPage <= 0)
          throw new ApolloError("Time per page has to be higher than 0.");

        args.userId = context.userInfo.userId;
        args.currentPage = args.startPage;
        const resp = await Exam.create({
          subject: args.subject,
          examDate: args.examDate,
          startDate: args.startDate,
          numberPages: args.numberPages,
          timePerPage: args.timePerPage,
          timesRepeat: args.timesRepeat || 1,
          currentPage: args.currentPage || 0,
          notes: args.notes,
          pdfLink: args.pdfLink,
          completed: args.completed || false,
          userId: args.userId
        });
        if (!resp) throw new ApolloError("Unable to add exam.");
      } catch (err) {
        handleResolverError(err);
      }
      return true;
    },
    updateCurrentPage: async (root, args, context, info) => {
      try {
        // console.log(args.page);

        if (!context.userInfo.isAuth) throw new Error("Unauthorised");
        const exam = await Exam.findOne({
          _id: args.examId,
          userId: context.userInfo.userId
        });
        if (!exam) throw new ApolloError("There is no exam with that id.");
        //TODO: MAKE SURE PAGE ISN'T HIGHER THAN MAX PAGES

        if (exam.currentPage === args.page) return true;
        if (args.page > exam.numberPages * exam.timesRepeat)
          throw new ApolloError(
            "The entered current page is higher than the number of pages for this exam."
          );

        // user.mascot = mascot;
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
