import { gql } from "apollo-server";

//TODO - DON'T ALLOW CLIENT TO BE ABLE TO QUERY PASSWORD
const examType = gql`
  scalar Date

  type Exam {
    id: ID!
    subject: String!
    examDate: Date!
    startDate: Date
    numberPages: Int!
    timePerPage: Int!
    timesRepeat: Int!
    startPage: Int!
    currentPage: Int!
    notes: String
    pdfLink: String
    color: String!
    completed: Boolean
    userId: ID!
  }

  # duration in minutes
  type Chunk {
    # examId: ID!
    # subject: String!
    exam: Exam!
    numberPagesToday: Int!
    duration: Int
    daysLeft: Int! #incl. today
    totalNumberDays: Int!
    # totalChunks: Int!
    numberPagesWithRepeat: Int! #exam.pages*repeat
    notEnoughTime: Boolean!
  }

  type CalendarChunkDetails {
    examDate: Date!
    currentPage: Int!
    numberPagesLeftTotal: Int!
    numberPagesPerDay: Int!
    durationTotal: Int!
    durationPerDay: Int!
  }

  type CalendarChunk {
    subject: String!
    start: Date!
    end: Date!
    details: CalendarChunkDetails!
    color: String!
  }
`;

module.exports = { examType };
