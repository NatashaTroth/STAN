import { gql } from "apollo-boost" //to make queries

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
    }
  }
`

const GET_EXAM_QUERY = gql`
  query($id: ID!) {
    exams(id: $id) {
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
    }
  }
`

const GET_TODAYS_CHUNKS = gql`
  query {
    todaysChunks {
      exam {
        id
        subject
        numberPages
        timePerPage
        timesRepeat
        currentPage
        pdfLink
      }
      numberPages
      duration
      daysLeft
      totalChunks
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
      googleLogin
    }
  }
`

export {
  GET_USERS_QUERY,
  GET_EXAMS_QUERY,
  SUCCESS_SIGNUP,
  CURRENT_USER,
  GET_TODAYS_CHUNKS,
  // GOOGLE_AUTH_URL,
}
