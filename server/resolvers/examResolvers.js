//TODO: EXTRACT ALL DATABASE LOGIC TO APOLLO DATASOURCE: https://www.apollographql.com/docs/tutorial/data-source/
const { User, Exam } = require("../models");
const { GraphQLScalarType } = require("graphql");
const { Kind } = require("graphql/language");

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
      // args.userId = User.find({id: args.userId}).id
      console.log(args);
      return Exam.create(args);
      // console.log("created user " + args)
    }
  },
  Date: new GraphQLScalarType({
    name: "Date",
    description: "Date custom scalar type",
    parseValue(value) {
      return new Date(value); // value from the client
    },
    serialize(value) {
      return value.getTime(); // value sent to the client
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.INT) {
        return new Date(ast.value); // ast value is always in string format
      }
      return null;
    }
  })
};

module.exports = {
  examResolvers
};
