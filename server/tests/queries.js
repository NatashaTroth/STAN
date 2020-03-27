import { gql } from "apollo-server"; //to make queries

const GET_EXAMS_QUERY = gql`
  {
    exams {
      id
      subject
      examDate
      startDate
      numberPages
      timePerPage
      currentPage
      notes
      pdfLink
      completed
      userId
    }
  }
`;

const CURRENT_USER = gql`
  query {
    currentUser {
      id
      username
      email
      mascot
      googleLogin
    }
  }
`;

export { GET_EXAMS_QUERY, CURRENT_USER };
