import { gql } from "apollo-boost" //to make queries

//TODO IMPORTANT - DELETE AS SOON AS POSSIBLE
export const GET_USERS_QUERY = gql`
  {
    users {
      id
      username
      email
      mascot
    }
  }
`

export const GET_EXAMS_QUERY = gql`
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

export const GET_EXAM_QUERY = gql`
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

export const GET_TODAYS_CHUNKS = gql`
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

//TODO: cache result of current user query - so you don't have to keep fetching it from the server - use apollo!
//https://www.youtube.com/watch?v=25GS0MLT8JU 2:52:35
export const CURRENT_USER = gql`
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
