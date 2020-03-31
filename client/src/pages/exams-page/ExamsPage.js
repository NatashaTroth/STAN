import React, { useState } from "react"
// --------------------------------------------------------------

// components
import CurrentExam from "../../components/current-exam/CurrentExam"

// sub components
// import Button from "../../components/button/Button"

// TODO: Add query to loop through current and archive exams
const Exams = () => {
  const [isArchiveOpen, setArchiveExams] = useState(false)

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

            <div className="current-exams">
              <CurrentExam subject="Backend Development" currentStatus="68%" />
              <CurrentExam subject="Programming" currentStatus="81%" />
              <CurrentExam subject="Business English" currentStatus="37%" />
              <CurrentExam subject="Programming" currentStatus="81%" />
              <CurrentExam subject="Multimedia" currentStatus="43%" />
            </div>

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
                <CurrentExam subject="Computer Networks" currentStatus="67%" />
                <CurrentExam subject="Math Statistics" currentStatus="98%" />
                <CurrentExam subject="Multimedia" currentStatus="43%" />
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
