import { gql } from "apollo-boost"

export const ADD_EXAM_MUTATION = gql`
  mutation(
    $subject: String!
    $examDate: Date!
    $startDate: Date!
    $lastPage: Int!
    $timePerPage: Int!
    $timesRepeat: Int
    $startPage: Int!
    $notes: String
    $studyMaterialLinks: [String]
    $completed: Boolean
  ) {
    addExam(
      subject: $subject
      examDate: $examDate
      startDate: $startDate
      lastPage: $lastPage
      timePerPage: $timePerPage
      timesRepeat: $timesRepeat
      startPage: $startPage
      notes: $notes
      studyMaterialLinks: $studyMaterialLinks
      completed: $completed
    )
  }
`

export const UPDATE_EXAM_MUTATION = gql`
  mutation(
    $id: ID!
    $subject: String!
    $examDate: Date!
    $startDate: Date!
    $lastPage: Int!
    $timePerPage: Int!
    $timesRepeat: Int!
    $startPage: Int!
    $currentPage: Int!
    $notes: String
    $studyMaterialLinks: [String] # $completed: Boolean
  ) {
    updateExam(
      id: $id
      subject: $subject
      examDate: $examDate
      startDate: $startDate
      lastPage: $lastPage
      timePerPage: $timePerPage
      timesRepeat: $timesRepeat
      startPage: $startPage
      currentPage: $currentPage
      notes: $notes
      studyMaterialLinks: $studyMaterialLinks # completed: $completed
    ) {
      id
      subject
      examDate
      startDate
      numberPages
      lastPage
      timePerPage
      timesRepeat
      startPage
      notes
      studyMaterialLinks
      completed
    }
  }
`

export const EXAM_COMPLETED_MUTATION = gql`
  mutation($id: ID!, $completed: Boolean!) {
    examCompleted(id: $id, completed: $completed)
  }
`

export const DELETE_EXAM_MUTATION = gql`
  mutation($id: ID!) {
    deleteExam(id: $id)
  }
`

export const UPDATE_CURRENT_PAGE_MUTATION = gql`
  mutation($examId: ID!, $page: Int!) {
    updateCurrentPage(examId: $examId, page: $page)
  }
`
