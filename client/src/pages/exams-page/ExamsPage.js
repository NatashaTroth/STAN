import React, { useState } from "react"
import { Redirect } from "react-router"
// --------------------------------------------------------------

// queries ----------------
import { GET_EXAMS_QUERY } from "../../graphQL/queries"
import { useQuery } from "@apollo/react-hooks"

// context ----------------
import { useCurrentUserValue } from "../../components/STAN/STAN"

// components ----------------
import CurrentExam from "../../components/current-exam/CurrentExam"

const Exams = () => {
  // state & queries ----------------
  const [isArchiveOpen, setArchiveExams] = useState(false)
  const { data, loading, error } = useQuery(GET_EXAMS_QUERY)

  // variables ----------------
  let exams

  // redirects ----------------
  const currentUser = useCurrentUserValue()
  if (currentUser === undefined) {
    return <Redirect to="/login" />
  }

  if (loading) return <p className="loading">loading...</p>
  if (error) return <p>error...(</p>
  if (data && data.exams) {
    // TODO: repeat is missing
    exams = data.exams.map(function(exam) {
      return (
        <div key={exam.id}>
          <CurrentExam
            subject={exam.subject}
            // TODO: rechnung überprüfen
            currentStatus={Math.round(
              (100 * exam.currentPage) / exam.numberPages
            )}
          />
        </div>
      )
    })
  }

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
              <h2>Current Exams</h2>
            </div>

            <div className="current-exams">{exams}</div>

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

            <div className={isArchiveOpen ? "show" : "close"}>
              <div className="archive-exams">
                {/* <CurrentExam subject="Computer Networks" currentStatus="67%" />
                <CurrentExam subject="Math Statistics" currentStatus="98%" />
                <CurrentExam subject="Multimedia" currentStatus="43%" /> */}
              </div>
            </div>
          </div>
          <div className="col-md-1"></div>
        </div>
      </div>
    </div>
  )
}

export default Exams
