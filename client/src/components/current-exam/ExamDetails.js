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

// helpers ----------------
import { getNumberOfDays, formatDate } from "../../helpers/dates"

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
      timesRepeat: data.exam.timesRepeat,
      currentPage: data.exam.currentPage,
      notes: data.exam.notes,
      pdfLink: data.exam.pdfLink,
    }
  }

  // calculation ----------------
  const today = new Date()

  const startDateUntilDeadline = getNumberOfDays(
    new Date(examDetails.startDate),
    new Date(examDetails.examDate)
  )

  const daysUntilDeadline = getNumberOfDays(
    today,
    new Date(examDetails.examDate)
  )

  const daysAfterStartDate = getNumberOfDays(
    new Date(examDetails.startDate),
    today
  )

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
                <div className="exam-details__inner--bar--right">
                  <a href="">edit</a>

                  <Button
                    variant="button"
                    onClick={() => {
                      history.goBack()
                    }}
                    className="closeExam"
                    text="close"
                  />
                </div>
                <span className="line"></span>
              </div>

              <div className="exam-details__inner--details">
                <div className="exam-details__inner--details--flex-container">
                  <div className="col-md-4">
                    <div className="exam-details__inner--details--left">
                      <div className="exam-date">
                        <h4>Exam date</h4>
                        <p>{formatDate(examDetails.examDate)}</p>
                      </div>

                      <div className="start-date">
                        <h4>Start learning on</h4>
                        <p>{formatDate(examDetails.startDate)}</p>
                      </div>

                      <div className="number-pages">
                        <h4>Amount of pages</h4>
                        <p>{examDetails.numberPages}</p>
                      </div>

                      <div className="time-per-pages">
                        <h4>Time per pages</h4>
                        <p>{examDetails.timePerPage} min.</p>
                      </div>

                      <div className="repeat">
                        <h4>Repeat</h4>
                        {examDetails.timesRepeat > 1 ? (
                          <p>{examDetails.timesRepeat} times</p>
                        ) : (
                          <p>{examDetails.timesRepeat} time</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="col-md-8">
                    <div className="exam-details__inner--details--right">
                      <div className="deadline">
                        <h4>Days until deadline</h4>

                        <div className="bar">
                          <ExamBar
                            percentage={
                              (100 * daysAfterStartDate) /
                              startDateUntilDeadline
                            }
                          />
                          <div className="bar--status">
                            <p>{daysUntilDeadline} days left</p>
                          </div>
                        </div>
                      </div>
                      <div className="pages">
                        <h4>Pages left</h4>

                        <div className="bar">
                          <ExamBar
                            percentage={
                              (100 * examDetails.currentPage) /
                              (examDetails.numberPages *
                                examDetails.timesRepeat)
                            }
                          />
                          <div className="bar--status">
                            <p>
                              {Math.round(
                                examDetails.numberPages -
                                  examDetails.currentPage
                              )}{" "}
                              pages left
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="studied">
                        <h4>Studied</h4>

                        <div className="bar">
                          <p>
                            {Math.round(
                              (100 * (examDetails.currentPage - 1)) /
                                examDetails.numberPages
                            )}
                            % of 100%
                          </p>
                        </div>
                      </div>
                      <div className="pages-studied">
                        <h4>Pages studied</h4>
                        <p>
                          {examDetails.currentPage}/{examDetails.numberPages}
                        </p>
                      </div>
                      <div className="pdf">
                        <div className="pdf--file">
                          <h4>PDF file</h4>

                          <p>{examDetails.pdfLink}</p>
                        </div>
                        <a
                          href={examDetails.pdfLink}
                          target="_blank"
                          className="stan-btn-secondary"
                        >
                          open
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-12">
                  <div className="exam-details__inner--details--bottom">
                    <h4>Notes</h4>

                    <div className="notes">
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
          </div>
          <div className="col-md-1"></div>
        </div>
      </div>
    </div>
  )
}

// progressbar component ----------------
const ExamBar = props => {
  return (
    <div className="exam-bar">
      <div
        className="exam-bar__filler"
        style={{ width: `${props.percentage}%` }}
      ></div>
    </div>
  )
}

export default ExamDetails
