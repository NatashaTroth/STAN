import { gql } from "apollo-server"; //to make queries

const LOGIN_MUTATION = gql`
  mutation($email: String!, $password: String) {
    login(email: $email, password: $password) {
      user {
        id
        username
        email
        mascot
      }
      accessToken
      tokenExpiration
    }
  }
`;
const SIGNUP_MUTATION = gql`
  mutation(
    $username: String!
    $email: String!
    $password: String
    $mascot: Int
  ) {
    signup(
      username: $username
      email: $email
      password: $password
      mascot: $mascot
    ) {
      user {
        id
        username
        email
      }
      accessToken
      tokenExpiration
    }
  }
`;

const UPDATE_MASCOT_MUTATION = gql`
  mutation($mascot: Int!) {
    updateMascot(mascot: $mascot) {
      successful
      user {
        mascot
      }
    }
  }
`;

const LOGOUT_MUTATION = gql`
  mutation {
    logout
  }
`;

const GOOGLE_LOGIN_MUTATION = gql`
  mutation($idToken: String!) {
    googleLogin(idToken: $idToken) {
      user {
        id
        username
        email
      }
      accessToken
      tokenExpiration
    }
  }
`;

//------------------Exam mutations:---------------
const ADD_EXAM_MUTATION = gql`
  mutation(
    $subject: String!
    $examDate: Date!
    $startDate: Date
    $numberPages: Int!
    $timePerPage: Int
    $timesRepeat: Int
    $currentPage: Int
    $notes: String
    $pdfLink: String
    $completed: Boolean
    $userId: ID!
  ) {
    addExam(
      subject: $subject
      examDate: $examDate
      startDate: $startDate
      numberPages: $numberPages
      timePerPage: $timePerPage
      timesRepeat: $timesRepeat
      currentPage: $currentPage
      notes: $notes
      pdfLink: $pdfLink
      completed: $completed
      userId: $userId
    )
  }
`;

export {
  LOGIN_MUTATION,
  SIGNUP_MUTATION,
  UPDATE_MASCOT_MUTATION,
  LOGOUT_MUTATION,
  GOOGLE_LOGIN_MUTATION,
  ADD_EXAM_MUTATION
};
