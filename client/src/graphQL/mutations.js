import { gql } from "apollo-boost" //to make queries

export const LOGIN_MUTATION = gql`
  mutation($email: String!, $password: String) {
    login(email: $email, password: $password)
  }
`

export const LOGOUT_MUTATION = gql`
  mutation {
    logout
  }
`

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
`

export const UPDATE_CURRENT_PAGE_MUTATION = gql`
  mutation($examId: ID!, $page: Int!) {
    updateCurrentPage(examId: $examId, page: $page)
  }
`

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
`

export const UPDATE_MASCOT_MUTATION = gql`
  mutation($mascot: Int!) {
    updateMascot(mascot: $mascot)
  }
`

export const GOOGLE_LOGIN_MUTATION = gql`
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
`
