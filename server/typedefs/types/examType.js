// import { gql } from "apollo-server";
const { gql } = require("apollo-server");

//TODO - DON'T ALLOW CLIENT TO BE ABLE TO QUERY PASSWORD
const examType = gql`
  scalar Date

  type Exam {
    id: ID!
    subject: String!
    examDate: Date!
    startDate: Date
    numberPages: Int
    timePerPage: Int
    timesRepeat: Int
    currentPage: Int
    notes: String
    pdfLink: String
    completed: Boolean
    userId: ID!
  }

  # duration in minutes
  type Chunk {
    subject: Subject!
    numberPages: Int!
    duration: Int!
  }
`;

module.exports = { examType };
