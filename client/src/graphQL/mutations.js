import { gql } from "apollo-boost" //to make queries

//!!Make sure the type in mutation here, is the same type as used by graphql
const ADD_BOOK_MUTATION = gql`
  mutation($name: String!, $genre: String!, $authorId: ID!) {
    addBook(name: $name, genre: $genre, authorId: $authorId) {
      name
      id
    }
  }
`

const LOGIN_MUTATION = gql`
  mutation($email: String!, $password: String!) {
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
`

const LOGOUT_MUTATION = gql`
  mutation {
    logout
  }
`

//!!Make sure the type in mutation here, is the same type as used by graphql
const ADD_EXAM_MUTATION = gql`
  mutation(
    $subject: String!
    $examDate: Date!
    $startDate: Date
    $numberPages: Int!
    $timePerPage: Int
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
      currentPage: $currentPage
      notes: $notes
      pdfLink: $pdfLink
      completed: $completed
      userId: $userId
    )
  }
`

const SIGNUP_MUTATION = gql`
  mutation(
    $username: String!
    $email: String!
    $password: String!
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
`

export {
  ADD_BOOK_MUTATION,
  ADD_EXAM_MUTATION,
  LOGIN_MUTATION,
  LOGOUT_MUTATION,
  SIGNUP_MUTATION,
}
