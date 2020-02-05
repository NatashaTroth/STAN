//TODO: EXTRACT ALL DATABASE LOGIC TO APOLLO DATASOURCE: https://www.apollographql.com/docs/tutorial/data-source/
import { Exam } from "../models";
import { GraphQLScalarType } from "graphql";
import { Kind } from "graphql/language";
import dayjs from "dayjs";

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
    addExam: (root, args, context, info) => {
      console.log("test");
      // args.userId = User.find({id: args.userId}).id
      console.log(args.examDate);
      return Exam.create(args);
      // console.log("created user " + args)
    }
  },
  Date: new GraphQLScalarType({
    name: "Date",
    description: "Date custom scalar type",
    parseValue(value) {
      console.log("parse date");
      return new Date(value); // value from the client
    },
    serialize(value) {
      console.log("serialize date");

      return value.getTime(); // value sent to the client
    },
    //This function is called when an inline input parameter should be parsed
    parseLiteral(ast) {
      console.log("parseLiteral date");
      // console.log(ast);

      // if (ast.kind === Kind.INT) {
      if (ast.kind === Kind.STRING) {
        console.log(new Date(ast.value));
        return new Date(ast.value); // ast value is always in string format
      }
      return null;
    }
  })
};

module.exports = {
  examResolvers
};
