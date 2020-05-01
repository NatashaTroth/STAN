import React, { useState } from "react"
import { Redirect, useHistory, useLocation } from "react-router-dom"
// --------------------------------------------------------------

// context ----------------
import { useCurrentUserValue } from "../../components/STAN/STAN"

// queries ----------------
import { GET_EXAM_QUERY } from "../../graphQL/queries"
import { DELETE_EXAM_MUTATION } from "../../graphQL/mutations"
import { useQuery, useMutation } from "@apollo/react-hooks"

// components ----------------
import ExamDetailsEdit from "../current-exam/ExamDetailsEdit"
import ExamDetailsInfo from "../current-exam/ExamDetailsInfo"

// sub-components ----------------
import Button from "../button/Button"
import QueryError from "../error/Error"
import Loading from "../loading/Loading"

const getParamId = location => {
  const searchParams = new URLSearchParams(location.search)
  return {
    id: searchParams.get("id") || "0",
  }
}

const ExamDetails = () => {
  // states ----------------
  let [edit, openEdit] = useState(false)
  let [popup, openPopup] = useState(false)

  // routes ----------------
  let history = useHistory()
  const location = useLocation()
  let paramId = getParamId(location)

  // query ----------------
  const { loading, error, data } = useQuery(GET_EXAM_QUERY, {
    variables: { id: paramId.id },
  })

  // mutation ----------------
  const [deleteExam] = useMutation(DELETE_EXAM_MUTATION)

  // redirects ----------------
  const currentUser = useCurrentUserValue()
  if (currentUser === undefined || paramId.id === "0") {
    return <Redirect to="/login" />
  }

  // variables ----------------
  let examDetails
  if (loading) return <Loading />
  if (error) return <QueryError errorMessage={error.message} />
  if (data) {
    examDetails = data.exam
  }

  // functions ----------------
  const handleEdit = () => {
    openEdit(edit => !edit)
  }

  const handlePopup = () => {
    openPopup(popup => !popup)
  }

  const handleDeletion = () => {
    examDeletion({ paramId, deleteExam })
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
                        {!edit && !examDetails.completed ? (
                          <Button
                            variant="button"
                            onClick={handleEdit}
                            className="exam-btn"
                            text="edit"
                          />
                        ) : null}

                        {edit && !examDetails.completed ? (
                          <Button
                            variant="button"
                            onClick={handleEdit}
                            className="exam-btn"
                            text="back"
                          />
                        ) : null}

                        {edit || examDetails.completed ? (
                          <Button
                            variant="button"
                            onClick={handlePopup}
                            className="exam-btn delete-btn"
                            text="delete"
                          />
                        ) : null}

                        <Button
                          variant="button"
                          onClick={() => {
                            history.goBack()
                          }}
                          className="exam-btn close-btn"
                          text="close"
                        />
                      </div>
                    </div>
                  </div>

                  {edit ? (
                    <div className="col-md-12">
                      <ExamDetailsEdit examId={examDetails.id} />
                    </div>
                  ) : null}

                  {!edit ? (
                    <div className="col-md-12">
                      <ExamDetailsInfo examDetails={examDetails} />
                    </div>
                  ) : null}

                  {popup ? (
                    <div className="col-md-12">
                      <div className="exam-details__popup">
                        <div className="container-fluid">
                          <div className="row">
                            <div className="exam-details__popup--inner box-content">
                              <div className="exam-details__popup--inner--headline">
                                <h4>
                                  Are you sure you want to delete this exam?
                                </h4>
                              </div>

                              <div className="exam-details__popup--inner--buttons">
                                <Button
                                  className="stan-btn-secondary"
                                  text="Yes"
                                  onClick={handleDeletion}
                                />
                                <Button
                                  className="stan-btn-primary"
                                  text="No"
                                  onClick={handlePopup}
                                />
                              </div>

                              <div className="col-md-12">
                                <p className="error graphql-exam-details-error"></p>
                              </div>

                              <div
                                className="col-md-12"
                                id="success-container-exam-detail"
                              >
                                <p className="success">
                                  the exam was successfully deleted
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : null}

                  <div className="col-md-12">
                    <div className="exam-details__inner--button">
                      <Button
                        className="stan-btn-primary"
                        variant="button"
                        text="Studied"
                      />
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

async function examDeletion({ paramId, deleteExam }) {
  try {
    const resp = await deleteExam({
      variables: {
        id: paramId.id,
      },
    })

    if (resp && resp.data && resp.data.deleteExam) {
      document.getElementById("success-container-exam-detail").style.display =
        "block"
    } else {
      throw new Error("The deletion of current exam failed.")
    }

    // redirect ----------------
    setTimeout(() => {
      window.location.href = "/exams"
    }, 1000)
  } catch (err) {
    // error handling ----------------
    let element = document.getElementsByClassName("graphql-exam-details-error")

    if (err.graphQLErrors && err.graphQLErrors[0]) {
      element[0].innerHTML = err.graphQLErrors[0].message
    } else {
      element[0].innerHTML = err.message
    }
  }
}
