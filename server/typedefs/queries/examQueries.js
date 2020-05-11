import { gql } from "apollo-server";

//TODO - DON'T ALLOW CLIENT TO BE ABLE TO QUERY CONFIDENTIAL DATA
const examQueries = gql`
  type Query {
    exams: [Exam]
    exam(id: ID!): Exam
    todaysChunkAndProgress: TodaysChunkAndProgress!
    calendarChunks: CalendarObject!
    examsCount: ExamsCount!
    todaysChunksProgress: Int!
  }

  type Mutation {
    #TODO: REFACTOR SO THAT VARIABLES ARE NOT DUPLICATED (WITH UPDATE)
    addExam(
      subject: String!
      examDate: Date!
      startDate: Date!
      numberPages: Int!
      timePerPage: Int!
      timesRepeat: Int
      startPage: Int
      notes: String
      studyMaterialLinks: [String]
      completed: Boolean
    ): Boolean

    updateExam(
      id: ID!
      subject: String!
      examDate: Date!
      startDate: Date!
      numberPages: Int!
      timePerPage: Int!
      timesRepeat: Int!
      startPage: Int!
      currentPage: Int!
      notes: String
      studyMaterialLinks: [String] # completed: Boolean
    ): Exam!

    #todo: change to just id
    updateCurrentPage(examId: ID!, page: Int!): Boolean
    deleteExam(id: ID!): Boolean
    examCompleted(id: ID!): Boolean
  }
`;

module.exports = { examQueries };
