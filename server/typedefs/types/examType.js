const { gql } = require("apollo-server");

//TODO - DON'T ALLOW CLIENT TO BE ABLE TO QUERY PASSWORD
const examType = gql`
  scalar Date

  type MyType {
    created: Date
  }

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
    user: User!
  }
`;

module.exports = { examType };
