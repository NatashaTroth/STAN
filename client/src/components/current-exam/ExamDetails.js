import React from "react"
import { Redirect, useHistory } from "react-router-dom"
// --------------------------------------------------------------

// context ----------------
import { useCurrentUserValue } from "../../components/STAN/STAN"

// queries ----------------
import { GET_EXAM_QUERY } from "../../graphQL/queries"
import { useQuery } from "@apollo/react-hooks"

// sub-components ----------------
import Button from "../button/Button"

const ExamDetails = props => {
  // get examId from props ----------------
  let { examId } = props.location.state
  let history = useHistory()

  // variables ----------------
  let examDetails
  // query ----------------
  const { loading, error, data } = useQuery(GET_EXAM_QUERY, {
    variables: { id: examId },
  })

  // redirects ----------------
  const currentUser = useCurrentUserValue()
  if (currentUser === undefined) {
    return <Redirect to="/login" />
  }

  if (loading) return <p className="loading">loading...</p>
  if (error) return <p>error...</p>
  if (data) {
    examDetails = {
      subject: data.exam.subject,
      examDate: data.exam.examDate,
      startDate: data.exam.startDate,
      numberPages: data.exam.numberPages,
      timePerPage: data.exam.timePerPage,
      currentPage: data.exam.currentPage,
      notes: data.exam.notes,
      pdfLink: data.exam.pdfLink,
    }
  }

  return (
    <div className="exam-details">
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-1"></div>
          <div className="col-md-10">
            <div className="exam-details__headline">
              <h2>{examDetails.subject}</h2>
              <Button
                variant="button"
                onClick={() => {
                  history.goBack()
                }}
                className="exam-details__headline--back-btn"
              />
            </div>

            <div className="exam-details__inner box-content">
              <div className="exam-details__inner--bar">
                <div className="exam-details__inner--bar--headline">
                  <h3>Exam details</h3>
                </div>
                <div className="exam-details__inner--bar--edit">
                  <a href="">edit</a>
                </div>
                <span className="line"></span>
              </div>

              <div className="exam-details__inner--details">
                <div className="col-md-4">
                  <div className="exam-details__inner--details--left">
                    <h4>Exam date</h4>
                    <p>{examDetails.examDate}</p>

                    <h4>Start learning on</h4>
                    <p>{examDetails.startDate}</p>

                    <h4>Amount of pages</h4>
                    <p>{examDetails.numberPages}</p>

                    <h4>Time per pages</h4>
                    <p>{examDetails.timePerPage} min</p>

                    <h4>Repeat</h4>
                    <p>1 time</p>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="exam-details__inner--details-right"></div>
                </div>

                <div className="col-md-10">
                  <div className="exam-details__inner--bottom">
                    <h4>Notes</h4>

                    {!examDetails.notes ? (
                      <p>...</p>
                    ) : (
                      <p>{examDetails.notes}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-1"></div>
        </div>
      </div>
    </div>
  )
}

export default ExamDetails
