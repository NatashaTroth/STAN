import { gql } from "apollo-boost" //to make queries

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
`

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
`

export const GET_TODAYS_CHUNKS_AND_PROGRESS = gql`
  query {
    todaysChunkAndProgress {
      todaysChunks {
        exam {
          id
          subject
          examDate
          startDate
          totalNumberDays
          numberPages
          timesRepeat
          timePerPage
          currentPage
          pdfLink
        }
        numberPagesToday
        startPage
        durationToday
        durationLeftToday
        daysLeft
        completed
      }
      todaysProgress
    }
  }
`

export const GET_CALENDAR_CHUNKS = gql`
  query {
    calendarChunks {
      calendarChunks {
        title
        start
        end
        color
        extendedProps {
          examDate
          currentPage
          numberPagesLeftTotal
          numberPagesPerDay
          durationTotal
          durationPerDay
          pdfLink
        }
      }
      calendarExams {
        title
        start
        end
        color
      }
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
      allowEmailNotifications
    }
  }
`

export const GET_TODAYS_CHUNKS_PROGRESS = gql`
  query {
    todaysChunksProgress
  }
`

export const GET_EXAMS_COUNT = gql`
  query {
    examsCount {
      currentExams
      finishedExams
    }
  }
`
