import React, { useState } from "react"
import { Redirect, useHistory, useLocation } from "react-router-dom"
import queryString from "query-string"
// --------------------------------------------------------------

// context ----------------
import { useCurrentUserValue } from "../../components/STAN/STAN"

// queries ----------------
import { GET_EXAM_QUERY } from "../../graphQL/queries"
import { useQuery } from "@apollo/react-hooks"

// components ----------------
import ExamDetailsEdit from "../current-exam/ExamDetailsEdit"

// sub-components ----------------
import Button from "../button/Button"
import ExamBar from "../progressbar/ProgressBar"

// helpers ----------------
import { getNumberOfDays, formatDate, minuteToHours } from "../../helpers/dates"

const getParamId = location => {
  let params = queryString.parse(location.search)
  return params.id
}

const ExamDetails = () => {
  // router & states ----------------
  let history = useHistory()
  let [edit, openEdit] = useState(false)
  const location = useLocation()

  // query ----------------
  const { loading, error, data } = useQuery(GET_EXAM_QUERY, {
    variables: { id: getParamId(location) },
  })

  // redirects ----------------
  const currentUser = useCurrentUserValue()
  if (currentUser === undefined) {
    return <Redirect to="/login" />
  }

  // variables ----------------
  let examDetails
  if (loading) return <p className="loading">loading...</p>
  if (error) window.location.reload()
  if (data) {
    examDetails = {
      id: data.exam.id,
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

  const todaysDayUntilDeadline = getNumberOfDays(
    today,
    new Date(examDetails.examDate)
  )

  // functions ----------------
  const handleEdit = () => {
    openEdit(edit => !edit)
  }

  // return ----------------
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
              <div className="container-fluid">
                <div className="row">
                  <div className="col-md-12">
                    <div className="exam-details__inner--bar">
                      <div className="exam-details__inner--bar--headline">
                        <h3>Exam details</h3>
                      </div>

                      <div className="exam-details__inner--bar--right">
                        <div
                          className={
                            edit ? "hideExamDetails" : "showExamDetails"
                          }
                        >
                          <Button
                            variant="button"
                            onClick={handleEdit}
                            className="editExam exam-btn"
                            text="edit"
                          />
                        </div>

                        <div
                          className={
                            edit ? "showExamDetails" : "hideExamDetails"
                          }
                        >
                          <Button
                            variant="button"
                            onClick={handleEdit}
                            className="editExam exam-btn"
                            text="back"
                          />

                          <Button
                            variant="button"
                            className="editExam exam-btn delete-btn"
                            text="delete"
                          />
                        </div>

                        <Button
                          variant="button"
                          onClick={() => {
                            history.goBack()
                          }}
                          className="closeExam exam-btn"
                          text="close"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="col-md-12">
                    <div className={edit ? "showForm" : "hideForm"}>
                      <div className="exam-details__inner--form">
                        <ExamDetailsEdit examId={examDetails.id} />
                      </div>
                    </div>
                  </div>

                  <div className="col-md-12">
                    <div
                      className={edit ? "hideExamDetails" : "showExamDetails"}
                    >
                      <div className="exam-details__inner--details">
                        <div className="container-fluid">
                          <div className="row">
                            <div className="col-md-4">
                              <div className="exam-details__inner--details--left">
                                <div className="exam-data">
                                  <h4>Exam date</h4>
                                  <p>{formatDate(examDetails.examDate)}</p>
                                </div>

                                <div className="exam-data">
                                  <h4>Start learning on</h4>
                                  <p>{formatDate(examDetails.startDate)}</p>
                                </div>

                                <div className="exam-data">
                                  <h4>Amount of pages</h4>
                                  <p>{examDetails.numberPages}</p>
                                </div>

                                <div className="exam-data">
                                  <h4>Time per pages</h4>
                                  <p>{examDetails.timePerPage} min.</p>
                                </div>

                                <div className="exam-data">
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
                                <div className="exam-data">
                                  <h4>Days until deadline</h4>
                                  <p>{todaysDayUntilDeadline} days left</p>
                                </div>
                                <div className="exam-data">
                                  <h4>Total learning effort</h4>
                                  <p>
                                    {minuteToHours(
                                      examDetails.numberPages *
                                        examDetails.timesRepeat *
                                        examDetails.timePerPage
                                    )}
                                  </p>
                                </div>
                                <div className="exam-pages">
                                  <h4>Pages left</h4>

                                  <div className="exam-pages__bar">
                                    <ExamBar
                                      value={
                                        (100 * examDetails.currentPage) /
                                        (examDetails.numberPages *
                                          examDetails.timesRepeat)
                                      }
                                    />

                                    <div className="exam-pages__bar--status">
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
                                <div className="exam-data">
                                  <h4>Pages studied</h4>
                                  <p>
                                    {examDetails.currentPage}/
                                    {examDetails.numberPages}
                                  </p>
                                </div>
                                <div className="exam-data pdf">
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
                        </div>

                        <div className="exam-details__inner--details--bottom">
                          <div className="container-fluid">
                            <div className="row">
                              <div className="col-md-12">
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

export default ExamDetails
