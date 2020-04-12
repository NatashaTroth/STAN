import React, { useState } from "react"
import { Redirect, useHistory, useLocation } from "react-router-dom"
// --------------------------------------------------------------

// context ----------------
import { useCurrentUserValue } from "../../components/STAN/STAN"

// queries ----------------
import { GET_EXAM_QUERY } from "../../graphQL/queries"
import { useQuery } from "@apollo/react-hooks"

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
  // router & states ----------------
  let history = useHistory()
  let [edit, openEdit] = useState(false)
  const location = useLocation()
  let paramId = getParamId(location)

  // query ----------------
  const { loading, error, data } = useQuery(GET_EXAM_QUERY, {
    variables: { id: paramId.id },
  })

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
