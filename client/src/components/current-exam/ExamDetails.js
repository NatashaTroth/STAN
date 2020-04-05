import React from "react"
import { Redirect, useHistory } from "react-router-dom"
// --------------------------------------------------------------

// context ----------------
import { useCurrentUserValue } from "../../components/STAN/STAN"

// queries ----------------
// import { GET_EXAM_QUERY } from "../../graphQL/queries"
import { useQuery } from "@apollo/react-hooks"
import { gql } from "apollo-boost"
import { Query } from "react-apollo"

// sub-components ----------------
import Button from "../button/Button"

// mapping query on client side ----------------
const GET_EXAM_QUERY = gql`
  query($id: ID!) {
    exam(id: $id) {
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

const ExamDetails = props => {
  // get examId from props ----------------
  let { examId } = props.location.state
  let history = useHistory()

  // query ----------------
  const { loading, error, data } = useQuery(GET_EXAM_QUERY, {
    variables: { id: examId },
  })

  // redirects ----------------
  const currentUser = useCurrentUserValue()
  if (currentUser === undefined) {
    return <Redirect to="/login" />
  }

  if (loading) return <p>loading...</p>
  if (error) return <p>error...</p>

  console.log(data)

  return (
    <div className="exam-details">
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-1"></div>
          <div className="col-md-10">
            <Button
              variant="button"
              onClick={() => {
                history.goBack()
              }}
              className="exam-details__back-btn"
            />
            <div className="exam-details__headline">
              <h2>Computer Networks</h2>
            </div>

            <div className="exam-details__inner box-content">
              <div className="exam-details__inner--bar">
                <div className="exam-details__inner--bar--headline">
                  <h3>Exam details</h3>
                </div>
                <div className="exam-details__inner--bar--edit">
                  <a href="">edit</a>
                </div>
              </div>

              <div className="exam-details__inner--details">
                <div className="col-md-4">
                  <div className="exam-details__inner--details--left">
                    <h4>Exam date</h4>
                    <p>30.02.2020</p>

                    <h4>Start learning on</h4>
                    <p>17.01.2020</p>

                    <h4>Amount of pages</h4>
                    <p>890</p>

                    <h4>Time per pages</h4>
                    <p>7 min</p>

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

                    <p>
                      Chapter 3 is the most important one, we do not need to
                      study chapter 1; including calculation tasks; draw graphs;
                      different colored pens for exam needed
                    </p>
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
