import { gql } from "apollo-server";

//TODO - DON'T ALLOW CLIENT TO BE ABLE TO QUERY PASSWORD
const examQueries = gql`
  type Query {
    exams: [Exam]!
    exam(id: ID!): Exam
  }

  type Mutation {
    addExam(
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
    ): Exam
  }
`;

module.exports = { examQueries };
