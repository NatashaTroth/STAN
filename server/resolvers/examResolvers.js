//TODO: EXTRACT ALL DATABASE LOGIC TO APOLLO DATASOURCE: https://www.apollographql.com/docs/tutorial/data-source/
import { Exam } from "../models";
import { GraphQLScalarType } from "graphql";
import { Kind } from "graphql/language";
import dayjs from "dayjs";
import {
  UserInputError,
  AuthenticationError,
  ApolloError
} from "apollo-server";

// console.log("here " + User);
// console.log(User.find())

//TODO: Authentication
const examResolvers = {
  Query: {
    exams: (root, arg, context, info) => {
      return Exam.find({});
      // return fetchData()
    },
    exam: (root, arg, context, info) => {
      return fetchOneDateData();
    }
  },
  Mutation: {
    addExam: async (root, args, context, info) => {
      if (!context.req.isAuth) throw new Error("Unauthorised");
      try {
        if (!args.userId) args.userId = context.req.userId;
        else if (args.userId !== context.req.userId)
          throw new AuthenticationError(
            "Not authorised to create an exam for the this user."
          );

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

module.exports = {
  examResolvers
};
