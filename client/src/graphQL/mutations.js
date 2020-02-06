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
      userId
      accessToken
      tokenExpiration
    }
  }
`

//!!Make sure the type in mutation here, is the same type as used by graphql
const ADD_EXAM_MUTATION = gql`
  mutation(
    $subject: String!
    $examDate: Date!
    $startDate: Date!
    $numberPages: Int!
    $timePerPage: Int!
    $currentPage: Int!
    $notes: String!
    $pdfLink: String!
    $completed: Boolean!
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
    ) {
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
`
// TODO: für $email, ein email prop oder string?
const ADD_USER_MUTATION = gql`
  mutation(
    $userId: ID!
    $username: String!
    $email: String!
    $password: String!
  ) {
    addUser(
      userId: $userId
      username: $username
      email: $email
      password: $password
    ) {
      id
      username
      email
    }
  }
`

export {
  ADD_BOOK_MUTATION,
  ADD_EXAM_MUTATION,
  ADD_USER_MUTATION,
  LOGIN_MUTATION,
}
