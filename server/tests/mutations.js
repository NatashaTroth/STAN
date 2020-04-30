import { gql } from "apollo-boost"; //to make queries

export const LOGIN_MUTATION = gql`
  mutation($email: String!, $password: String) {
    login(email: $email, password: $password)
  }
`;

export const LOGOUT_MUTATION = gql`
  mutation {
    logout
  }
`;

//!!Make sure the type in mutation here, is the same type as used by graphql
export const ADD_EXAM_MUTATION = gql`
  mutation(
    $subject: String!
    $examDate: Date!
    $startDate: Date!
    $numberPages: Int!
    $timePerPage: Int!
    $timesRepeat: Int
    $startPage: Int
    $notes: String
    $pdfLink: String
    $completed: Boolean
  ) {
    addExam(
      subject: $subject
      examDate: $examDate
      startDate: $startDate
      numberPages: $numberPages
      timePerPage: $timePerPage
      timesRepeat: $timesRepeat
      startPage: $startPage
      notes: $notes
      pdfLink: $pdfLink
      completed: $completed
    )
  }
`;

export const UPDATE_EXAM_MUTATION = gql`
  mutation(
    $id: ID!
    $subject: String!
    $examDate: Date!
    $startDate: Date!
    $numberPages: Int!
    $timePerPage: Int!
    $timesRepeat: Int
    $startPage: Int
    $currentPage: Int
    $notes: String
    $pdfLink: String # $completed: Boolean
  ) {
    updateExam(
      id: $id
      subject: $subject
      examDate: $examDate
      startDate: $startDate
      numberPages: $numberPages
      timePerPage: $timePerPage
      timesRepeat: $timesRepeat
      startPage: $startPage
      currentPage: $currentPage
      notes: $notes
      pdfLink: $pdfLink # completed: $completed
    ) {
      id
      subject
      examDate
      startDate
      numberPages
      timePerPage
      timesRepeat
      startPage
      notes
      pdfLink
      completed
    }
  }
`;

export const DELETE_EXAM_MUTATION = gql`
  mutation($id: ID!) {
    deleteExam(id: $id)
  }
`;

export const UPDATE_CURRENT_PAGE_MUTATION = gql`
  mutation($examId: ID!, $page: Int!) {
    updateCurrentPage(examId: $examId, page: $page)
  }
`;

export const SIGNUP_MUTATION = gql`
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
    )
  }
`;

export const UPDATE_MASCOT_MUTATION = gql`
  mutation($mascot: Int!) {
    updateMascot(mascot: $mascot)
  }
`;

export const GOOGLE_LOGIN_MUTATION = gql`
  mutation($idToken: String!) {
    googleLogin(idToken: $idToken)
  }
`;

export const UPDATE_USER_MUTATION = gql`
  mutation(
    $username: String!
    $email: String!
    $password: String
    $newPassword: String
    $mascot: Int!
  ) {
    updateUser(
      username: $username
      email: $email
      password: $password
      newPassword: $newPassword
      mascot: $mascot
    ) {
      id
      username
      email
      mascot
      googleLogin
    }
  }
`;

export const DELETE_USER_MUTATION = gql`
  mutation {
    deleteUser
  }
`;

export const EXAM_COMPLETED_MUTATION = gql`
  mutation($id: ID!) {
    examCompleted(id: $id)
  }
`;
