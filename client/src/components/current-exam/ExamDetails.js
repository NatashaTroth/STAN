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
  if (loading) return <p className="loading">loading...</p>
  if (error) return <p>error...</p>
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
    examDeletion({ paramId, deleteExam, history })
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
                    <div className="exam-details__popup">
                      <div className="exam-details__popup--inner box-content">
                        <div className="exam-details__popup--inner--headline">
                          <h4>Are you sure you want to delete this exam?</h4>
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
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-1"></div>
          <div className="col-md-12" id="success-container-edit-exam">
            <p className="success">the exam was successfully deleted</p>
          </div>
          <div className="col-md-12" id="success-container-error-exam">
            <p className="error">
              Oops! an error occurred whilst deleting stan's memory
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ExamDetails

async function examDeletion({ paramId, deleteExam, history }) {
  try {
    const resp = await deleteExam({
      variables: {
        id: paramId.id,
      },
    })

    if (resp && resp.data && resp.data.deleteExam) {
      document.getElementById("success-container-edit-exam").style.display =
        "block"
    } else {
      document.getElementById("success-container-error-exam").style.display =
        "block"
    }

    history.push("/exams")
    window.location.reload()
  } catch (err) {
    //TODO: USER DEN ERROR MITTEILEN
    console.error(err.message)
    // console.log(err)
  }
}
