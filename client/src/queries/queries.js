import { gql } from "apollo-boost"; //to make queries

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
`;

//!! no space after gql!! - parsing graphql query to js
const GET_BOOKS_QUERY = gql`
  {
    books {
      name
      id
    }
  }
`;

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
`;

const GET_AUTHORS_QUERY = gql`
  {
    authors {
      name
      id
    }
  }
`;

//!!Make sure the type in mutation here, is the same type as used by graphql
const ADD_BOOK_MUTATION = gql`
  mutation($name: String!, $genre: String!, $authorId: ID!) {
    addBook(name: $name, genre: $genre, authorId: $authorId) {
      name
      id
    }
  }
`;

export {
  GET_USERS_QUERY,
  GET_AUTHORS_QUERY,
  GET_BOOKS_QUERY,
  GET_BOOK_QUERY,
  ADD_BOOK_MUTATION
};
