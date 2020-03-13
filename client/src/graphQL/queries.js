import { gql } from "apollo-boost" //to make queries

//!! no space after gql!! - parsing graphql query to js
const GET_USERS_QUERY = gql`
  {
    users {
      id
      username
      email
      mascot
    }
  }
`

//!! no space after gql!! - parsing graphql query to js
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
`

//!! no space after gql!! - parsing graphql query to js
const GET_BOOKS_QUERY = gql`
  {
    books {
      name
      id
    }
  }
`

const GET_BOOK_QUERY = gql`
  query($id: ID!) {
    book(id: $id) {
      id
      name
      genre
      author {
        id
        name
        age
        books {
          name
          id
        }
      }
    }
  }
`

const GET_AUTHORS_QUERY = gql`
  {
    authors {
      name
      id
    }
  }
`

const SUCCESS_SIGNUP = gql`
  {
    user {
      username
      email
      password
    }
  }
`

//TODO: cache result of current user query - so you don't have to keep fetching it from the server - use apollo!
//https://www.youtube.com/watch?v=25GS0MLT8JU 2:52:35
const CURRENT_USER = gql`
  query {
    currentUser {
      id
      username
      email
      mascot
    }
  }
`

const GOOGLE_AUTH_URL = gql`
  query {
    googleAuthUrl
  }
`

export {
  GET_USERS_QUERY,
  GET_EXAMS_QUERY,
  GET_AUTHORS_QUERY,
  GET_BOOKS_QUERY,
  GET_BOOK_QUERY,
  SUCCESS_SIGNUP,
  CURRENT_USER,
  GOOGLE_AUTH_URL,
}
