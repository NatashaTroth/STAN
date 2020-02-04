import { gql } from "apollo-boost" //to make queries

//!! no space after gql!! - parsing graphql query to js
const GET_USERS_QUERY = gql`
  {
    users {
      id
      username
      email
      photoLink
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

export {
  GET_USERS_QUERY,
  GET_EXAMS_QUERY,
  GET_AUTHORS_QUERY,
  GET_BOOKS_QUERY,
  GET_BOOK_QUERY,
}
