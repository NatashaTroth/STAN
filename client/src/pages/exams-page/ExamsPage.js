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
  let currentExamsList, archiveExamsList

  // redirects ----------------
  const currentUser = useCurrentUserValue()
  if (currentUser === undefined) {
    return <Redirect to="/login" />
  }

  if (loading) return <p className="loading">loading...</p>
  if (error) return <p>error...(</p>
  if (data && data.exams) {
    currentExams = data.exams.map(function(exam) {
      if (!exam.completed) {
        return {
          id: exam.id,
          subject: exam.subject,
          numberPages: exam.numberPages,
          currentPage: exam.currentPage,
          timesRepeat: exam.timesRepeat,
        }
      }
      return null
    })
    archiveExams = data.exams.map(function(exam) {
      if (exam.completed) {
        return {
          id: exam.id,
          subject: exam.subject,
          numberPages: exam.numberPages,
          currentPage: exam.currentPage,
          timesRepeat: exam.timesRepeat,
        }
      }
      return null
    })
  }

  // functions ----------------
  currentExamsList = currentExams.map(function(exam) {
    if (exam === null) {
      return null
    } else {
      return (
        <div key={exam.id}>
          <Link
            to={{
              pathname: `${url}/${exam.subject
                .toLowerCase()
                .replace(/ /g, "-")}?id=${exam.id}`,
            }}
          >
            <Exam
              subject={exam.subject}
              currentStatus={Math.round(
                (100 * exam.currentPage) / (exam.numberPages * exam.timesRepeat)
              )}
            />
          </Link>
        </div>
      )
    }
  })

  archiveExamsList = archiveExams.map(function(exam) {
    if (exam === null) {
      return null
    } else {
      return (
        // TODO: implement exam detail for archive section
        <div key={exam.id}>
          <Link
            to={{
              pathname: `${url}/${exam.subject
                .toLowerCase()
                .replace(/ /g, "-")}?id=${exam.id}`,
            }}
          >
            <Exam
              subject={exam.subject}
              currentStatus={Math.round(
                (100 * exam.currentPage) / (exam.numberPages * exam.timesRepeat)
              )}
            />
          </Link>
        </div>
      )
    }
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

            {currentExamsList.length === 0 ? (
              <div className="exams__empty">
                <div className="container-fluid">
                  <div className="row">
                    <div className="col-md-2"></div>
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
                    </div>
                    <div className="col-md-2"></div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="exams__current-exams">{currentExamsList}</div>
            )}

            <div className="exams__toggle-archive">
              <button
                variant="button"
                onClick={handleArchiveClick}
                className="exams__toggle-archive--button"
              >
                <h3>Past exams</h3>
              </button>
              <i className={isArchiveOpen ? "arrow down" : "arrow right"}></i>
            </div>

            <AnimateHeight duration={500} height={height}>
              <div className="exams__archive-exams">{archiveExamsList}</div>
            </AnimateHeight>
          </div>
          <div className="col-md-1"></div>
        </div>
      </div>
    </div>
  )
}

export default Exams
