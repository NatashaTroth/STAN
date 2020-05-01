import { gql } from "apollo-boost"; //to make queries

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
`;

export const GET_EXAMS_QUERY = gql`
  {
    exams {
      id
      subject
      examDate
      startDate
      numberPages
      timePerPage
      timesRepeat
      currentPage
      startPage
      notes
      pdfLink
      completed
    }
  }
`;

export const GET_EXAM_QUERY = gql`
  query($id: ID!) {
    exam(id: $id) {
      id
      subject
      examDate
      startDate
      numberPages
      timePerPage
      timesRepeat
      currentPage
      startPage
      notes
      pdfLink
      completed
    }
  }
`;

export const GET_TODAYS_CHUNKS = gql`
  query {
    todaysChunks {
      exam {
        id
        subject
        examDate
        startDate
        totalNumberDays
        numberPages
        timesRepeat
        currentPage
        pdfLink
      }
      numberPagesToday
      startPage
      currentPage
      durationToday
      daysLeft
      notEnoughTime
      completed
    }
  }
`;

export const GET_CALENDAR_CHUNKS = gql`
  query {
    calendarChunks {
      subject
      start
      end
      details {
        examDate
        currentPage
        numberPagesLeftTotal
        numberPagesPerDay
        durationTotal
        durationPerDay
      }
      color
    }
  }
`;

//TODO: cache result of current user query - so you don't have to keep fetching it from the server - use apollo!
//https://www.youtube.com/watch?v=25GS0MLT8JU 2:52:35
//TODO: DO I NEED TO RETURN THE ID? SINCE ALREADY IN ACCESSTOKEN
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
`;

export const GET_TODAYS_CHUNKS_PROGRESS = gql`
  query {
    todaysChunksProgress
  }
`;

export const GET_EXAMS_COUNT = gql`
  query {
    examsCount {
      currentExams
      finishedExams
    }
  }
`;
