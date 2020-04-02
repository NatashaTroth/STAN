// import { gql } from "apollo-server";
const { gql } = require("apollo-server");

//TODO - DON'T ALLOW CLIENT TO BE ABLE TO QUERY CONFIDENTIAL DATA
const examQueries = gql`
  type Query {
    exams: [Exam]!
    exam(id: ID!): Exam!
    todaysChunks: [Chunk]!
  }

  type Mutation {
    addExam(
      subject: String!
      examDate: Date
      startDate: Date
      numberPages: Int
      timePerPage: Int
      timesRepeat: Int
      startPage: Int
      notes: String
      pdfLink: String
      completed: Boolean
    ): Boolean

    updateCurrentPage(examId: ID!, page: Int!): Boolean
  }
`;

module.exports = { examQueries };
