import React from "react"
import { Redirect, useHistory } from "react-router-dom"
// onClick={() => history.goBack()
// context ----------------
import { useCurrentUserValue } from "../../components/STAN/STAN"

// queries ----------------
import { GET_EXAM_QUERY } from "../../graphQL/queries"
import { useQuery } from "@apollo/react-hooks"

const ExamDetails = props => {
  //   const { data, loading, error } = useQuery(GET_EXAM_QUERY)
  const examId = props.location.state.id

  // variables ----------------
  let exam = []

  //   var root = {
  //     exams: examId => {
  //       exam.push({
  //         id: examId.id,
  //         subject: examId.subject,
  //         examDate: examId.examDate,
  //         startDate: examId.startDate,
  //         numberPages: examId.numberPages,
  //         timePerPage: examId.timePerPage,
  //         timesRepeat: examId.timesRepeat,
  //         currentPage: examId.currentPage,
  //         pdfLink: examId.pdfLink,
  //       })
  //     },
  //   }

  console.log(exam)

  // redirects ----------------
  const currentUser = useCurrentUserValue()
  if (currentUser === undefined) {
    return <Redirect to="/login" />
  }

  //   if (loading) return <p className="loading">loading...</p>
  //   if (error) return <p>error...exam details</p>

  return (
    <div className="exam-details">
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-1"></div>
          <div className="col-md-10">
            <div className="exam-details__headline">
              <h2>Subject</h2>
            </div>

            <div className="exam-details__inner box-content"></div>
          </div>
          <div className="col-md-1"></div>
        </div>
      </div>
    </div>
  )
}

export default ExamDetails
