import React, { useState } from "react"
import { useQuery } from "@apollo/react-hooks"
import { Redirect, Link, useRouteMatch } from "react-router-dom"
// --------------------------------------------------------------

// queries ----------------
import { GET_EXAMS_QUERY, CURRENT_USER } from "../../graphQL/queries"

// components ----------------
import Exam from "../../components/exams/Exam"
import QueryError from "../../components/error/Error"
import Loading from "../../components/loading/Loading"

// apolloClient cache ----------------
import { client } from "../../apolloClient"

// helpers ----------------
import { decodeHtml, calcExamProgress } from "../../helpers/mascots"

const Exams = () => {
  // router ----------------
  let { url } = useRouteMatch()

  // state & queries ----------------
  const [isArchiveOpen, setArchiveExams] = useState(false)
  const { loading, error } = useQuery(GET_EXAMS_QUERY)

  // variables ----------------
  let currentExams, archiveExams
  let currentExamsList = []
  let archiveExamsList = []

  // redirects ----------------
  const currentUser = client.readQuery({ query: CURRENT_USER }).currentUser
  if (currentUser === null) {
    return <Redirect to="/login" />
  }

  // loading & error handling ----------------
  if (loading) return <Loading />
  if (error) return <QueryError errorMessage={error.message} />

  // run query in cache ----------------
  const data = client.readQuery({ query: GET_EXAMS_QUERY }).exams

  data.forEach(exam => {
    if (!exam.completed) {
      currentExamsList.push({
        id: exam.id,
        subject: exam.subject,
        numberPages: exam.numberPages,
        currentPage: exam.currentPage,
        startPage: exam.startPage,
        timesRepeat: exam.timesRepeat,
      })
    } else {
      archiveExamsList.push({
        id: exam.id,
        subject: exam.subject,
        numberPages: exam.numberPages,
        currentPage: exam.currentPage,
        startPage: exam.startPage,
        timesRepeat: exam.timesRepeat,
      })
    }
  })

  // functions ----------------
  currentExams = currentExamsList.map(function(exam) {
    return (
      <div key={exam.id}>
        <Link
          to={`${url}/${exam.subject.toLowerCase().replace(/ /g, "-")}?id=${
            exam.id
          }`}
        >
          <Exam
            subject={decodeHtml(exam.subject)}
            currentStatus={calcExamProgress(exam)}
          />
        </Link>
      </div>
    )
  })

  archiveExams = archiveExamsList.map(function(exam) {
    return (
      <div key={exam.id}>
        <Link
          to={`${url}/${exam.subject.toLowerCase().replace(/ /g, "-")}?id=${
            exam.id
          }`}
        >
          <Exam
            subject={decodeHtml(exam.subject)}
            currentStatus={calcExamProgress(exam)}
          />
        </Link>
      </div>
    )
  })

  const handleArchiveClick = () => {
    setArchiveExams(!isArchiveOpen)
  }

  // return ----------------
  return (
    <div className="exams">
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-1"></div>
          <div className="col-md-10">
            <div className="exams__headline">
              <h2>Exams</h2>
            </div>
          </div>
          <div className="col-md-1"></div>
        </div>
      </div>

      <div className="container-fluid">
        <div className="row">
          <div className="col-md-1"></div>
          <div className="col-md-10">
            {currentExamsList.length === 0 ? (
              <div className="exams__empty">
                <div className="container-fluid">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="exams__empty__content box-content">
                        <div className="exams__empty__content--headline">
                          <h3>no open exams</h3>
                        </div>

                        <div className="exams__empty__content--text">
                          <p>
                            Are you sure there are no exams you need to study
                            for?
                          </p>
                        </div>

                        <div className="exams__empty__content--btn">
                          <Link to="/add-new" className="stan-btn-primary">
                            Add exam
                          </Link>
                        </div>
                      </div>
                      <div className="col-md-6"></div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="exams__currentExams">{currentExams}</div>
            )}

            <div className="exams__archiveExamsToggle">
              <button
                variant="button"
                onClick={handleArchiveClick}
                className="exams__archiveExamsToggle--button"
              >
                <h3>Past exams</h3>
                <i className={isArchiveOpen ? "arrow down" : "arrow right"}></i>
              </button>
            </div>

            <div className={isArchiveOpen ? "fadeIn" : "fadeOut"}>
              {archiveExamsList.length === 0 ? (
                <div className="exams__empty">
                  <div className="container-fluid">
                    <div className="row">
                      <div className="col-md-4">
                        <div className="exams__empty--pastExams box-content">
                          <p>no past exams</p>
                        </div>
                      </div>
                      <div className="col-md-8"></div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="exams__archiveExams">{archiveExams}</div>
              )}
            </div>
          </div>
          <div className="col-md-1"></div>
        </div>
      </div>
    </div>
  )
}

export default Exams
