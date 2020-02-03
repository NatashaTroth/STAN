//TODO: EXTRACT ALL DATABASE LOGIC TO APOLLO DATASOURCE: https://www.apollographql.com/docs/tutorial/data-source/
const { User, Exam } = require("../models");
const { GraphQLScalarType } = require("graphql");
const { Kind } = require("graphql/language");

// const User = require("../models/user");
// const Exam = require("../models/exam");
// import { GraphQLScalarType } from 'graphql';
// import { Kind } from 'graphql/language';
// const Author = require('../models/author')

console.log("here " + User);
// console.log(User.find())

//TODO: Authentication
const resolvers = {
  Query: {
    users: (root, arg, context, info) => {
      return User.find({});
      // return fetchData()
    },
    // user:(root, arg, context, info)=>{
    //     return fetchOneData()
    // },
    exams: (root, arg, context, info) => {
      return Exam.find({});
      // return fetchData()
    },
    exam: (root, arg, context, info) => {
      return fetchOneDateData();
    }
  },
  Mutation: {
    addUser: (root, args, context, info) => {
      return User.create(args);
      // console.log("created user " + args)
    },
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

module.exports = resolvers;

// var  fetchData = ()=>{

//   var fakeUsers =  [
//       {
//         "id": "BJrp-DudG",
//         "username": "testname",
//         "password": "alice123",
//         "email": "alice@facegle.io",
//         "photoLink": "testlink",
//         "mascot": 1
//       },
//       {
//         "id": "ry9pbwdOz",
//         "username": "test2",
//         "password": "bob123",
//         "email": "bob@goobook.co",
//         "photoLink": "testlink",
//         "mascot": 1
//       }
//     ]
//   return fakeUsers;

//   }

var fetchOneData = () => {
  return {
    id: "BJrp-DudG",
    username: "testname",
    password: "alice123",
    email: "alice@facegle.io",
    photoLink: "testlink",
    mascot: 1
  };
};

var fetchOneDateData = () => {
  return {
    id: "1",
    subject: "testname",
    examDate: "alice123",
    startDate: "alice@facegle.io",
    numberPages: 1,
    timePerPage: 1,
    timesRepeat: 1,
    notes: "alice@facegle.io",
    pdfLink: "alice@facegle.io",
    completed: "alice@facegle.io",
    user: "1"
  };
};
