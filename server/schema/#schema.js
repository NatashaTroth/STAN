//Schema is to define types, relationships and queries

const graphql = require("graphql");

//import mongoDB Schemas
const User = require("../models/user");
const Exam = require("../models/exam");
const MotivationalSayings = require("../models/motivationalSayings");

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLInt,
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
  GraphQLBooleanp
} = graphql;

//Every book has an author, and every author has collection of books

//resolve sends back which author corresponds to this book (just like resolve in query) - parent object = this book
const ExamType = new GraphQLObjectType({
  name: "Exam",
  fields: () => ({
    id: { type: GraphQLID },
    subject: { type: GraphQLString },
    examDate: { type: GraphQLString },
    startDate: { type: GraphQLString },
    numberPages: { type: GraphQLInt },
    timePerPage: { type: GraphQLString },
    timesRepeat: { type: GraphQLString },
    currentPage: { type: GraphQLString },
    notes: { type: GraphQLString },
    pdfLink: { type: GraphQLString },
    completed: { type: GraphQLBoolean },
    user: {
      type: UserType,
      resolve(parent, args) {
        return User.findById(parent.userId);
        //  return _.find(authors, {id: parent.authorId})
      }
    }
  })
});

//books - is not booktype, because it can be more then one, so it is a list
const UserType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: { type: GraphQLID },
    username: { type: GraphQLString },
    password: { type: GraphQLString },
    email: { type: GraphQLString },
    photoLink: { type: GraphQLString },
    mascot: { type: GraphQLInt },
    exams: {
      type: new GraphQLList(ExamType),
      resolve(parent, args) {
        // console.log(parent) //author
        //return _.filter(books, {authorId: parent.id})
        return Exam.find({ userId: parent.id });
        //find -> returns all
      }
    }
  })
});

//Rootquery is where you can jump into the graph to get data (from the frontend)
//fields -> different kinds of rootquery, not a function, cause order doesn't matter
//resolve looks at the data and returns what is needed
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    exam: {
      type: ExamType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        //code to get data from db / other source

        //using lodash to make finding stuff in array easier (can also use vanilla js - can then delete lodash)
        // return _.find(books, {id: args.id})    //returns book with the same id as the user has sent
        return Exam.findById(args.id);
      }
    },
    user: {
      type: UserType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        // return _.find(authors, {id: args.id})
        return User.findById(args.id);
      }
    },
    exams: {
      type: new GraphQLList(ExamType),
      resolve(parent, args) {
        //   return (books)
        return Exam.find({}); //returns all Books - cause all match
      }
    },
    users: {
      type: new GraphQLList(UserType),
      resolve(parent, args) {
        //   return (authors)
        return User.find({});
      }
    }
  }
});

//non null - so have to pass that property through, only need on mutations
const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addUser: {
      type: UserType,
      args: {
        username: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
        photoLink: { type: new GraphQLNonNull(GraphQLString) },
        mascot: { type: new GraphQLNonNull(GraphQLInt) }
      },
      resolve(parent, args) {
        //Make new Author Model/Datatype - how mongoose works
        let user = User({
          username: args.username,
          password: args.password,
          email: args.email,
          photoLink: args.photoLink,
          mascot: args.mascot
        });
        return user.save(); //mongoose - need "return", or else get nothing back - but still saved in db
      }
    },
    addExam: {
      type: ExamType,
      args: {
        subject: { type: new GraphQLNonNull(GraphQLString) },
        examDate: { type: new GraphQLNonNull(GraphQLString) },
        startDate: { type: new GraphQLNonNull(GraphQLString) },
        numberPages: { type: new GraphQLNonNull(GraphQLID) },
        timePerPage: { type: new GraphQLNonNull(GraphQLID) },
        timesRepeat: { type: new GraphQLNonNull(GraphQLID) },
        currentPage: { type: new GraphQLNonNull(GraphQLID) },
        notes: { type: new GraphQLNonNull(GraphQLString) },
        pdfLink: { type: new GraphQLNonNull(GraphQLString) },
        completed: { type: new GraphQLNonNull(GraphQLBoolean) },
        userId: { type: new GraphQLNonNull(GraphQLID) }
      },
      resolve(parent, args) {
        let exam = new Exam({
          subject: args.subject,
          examDate: args.examDate,
          startDate: args.startDate,
          numberPages: args.numberPages,
          timePerPage: args.timePerPage,
          timesRepeat: args.timesRepeat,
          currentPage: args.currentPage,
          notes: args.notes,
          pdfLink: args.pdfLink,
          completed: args.completed,
          userId: args.userId
        });
        return exam.save();
      }
    }
  }
});

//when query from the frontend - the name of the rootquery is used. when
//args -> what has to be sent when querying, so i know what book it is (here they have to say what id)
//frontend: book(id:'123'){name genre} - id type is id, so "123" or 123 work - !!! has to be " not '
//Type of args.id = string
//parent -> relationships between data, args is access to the args passed before (e.g. args.id)

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
});
