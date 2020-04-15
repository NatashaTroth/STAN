import React, { useState } from "react"
import { Redirect, Link, useRouteMatch } from "react-router-dom"
// --------------------------------------------------------------

// context ----------------
import { useCurrentUserValue } from "../../components/STAN/STAN"

// queries ----------------
import { GET_EXAMS_QUERY } from "../../graphQL/queries"
import { useQuery } from "@apollo/react-hooks"

// components ----------------
import Exam from "../../components/current-exam/Exam"
import QueryError from "../../components/error/Error"

// animation ----------------
import AnimateHeight from "react-animate-height"

const Exams = () => {
  // router ----------------
  let { url } = useRouteMatch()

  // state & queries ----------------
  const [isArchiveOpen, setArchiveExams] = useState(false)
  const [height, setHeight] = useState(0)
  const { data, loading, error } = useQuery(GET_EXAMS_QUERY)

  // variables ----------------
  let currentExams, archiveExams
  let currentExamsList = []
  let archiveExamsList = []

  // redirects ----------------
  const currentUser = useCurrentUserValue()
  if (currentUser === undefined) {
    return <Redirect to="/login" />
  }

  if (loading) return <p className="loading">loading...</p>
  if (error) return <QueryError />
  if (data && data.exams) {
    data.exams.forEach(exam => {
      if (!exam.completed) {
        currentExamsList.push({
          id: exam.id,
          subject: exam.subject,
          numberPages: exam.numberPages,
          currentPage: exam.currentPage,
          timesRepeat: exam.timesRepeat,
        })
      } else {
        archiveExamsList.push({
          id: exam.id,
          subject: exam.subject,
          numberPages: exam.numberPages,
          currentPage: exam.currentPage,
          timesRepeat: exam.timesRepeat,
        })
      }
    })
  }

  // functions ----------------
  currentExams = currentExamsList.map(function(exam) {
    return (
      <div key={exam.id}>
        <a
          href={`${url}/${exam.subject.toLowerCase().replace(/ /g, "-")}?id=${
            exam.id
          }`}
        >
          <Exam
            subject={exam.subject}
            currentStatus={Math.round(
              (100 * exam.currentPage) / (exam.numberPages * exam.timesRepeat)
            )}
          />
        </a>
      </div>
    )
  })

  archiveExams = archiveExamsList.map(function(exam) {
    return (
      <div key={exam.id}>
        <a
          href={`${url}/${exam.subject.toLowerCase().replace(/ /g, "-")}?id=${
            exam.id
          }`}
        >
          <Exam
            subject={exam.subject}
            currentStatus={Math.round(
              (100 * exam.currentPage) / (exam.numberPages * exam.timesRepeat)
            )}
          />
        </a>
      </div>
    )
  })

  const handleArchiveClick = () => {
    setArchiveExams(!isArchiveOpen)
    setHeight(height === 0 ? "auto" : 0)
  }

  // return ----------------
  return (
    <div className="exams">
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-1"></div>
          <div className="col-md-10">
            <div className="exams__headline">
              <h2>Current Exams</h2>
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
              </button>
              <i className={isArchiveOpen ? "arrow down" : "arrow right"}></i>
            </div>

            <AnimateHeight duration={500} height={height}>
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
            </AnimateHeight>
          </div>
          <div className="col-md-1"></div>
        </div>
      </div>
    </div>
  )
}

export default Exams
