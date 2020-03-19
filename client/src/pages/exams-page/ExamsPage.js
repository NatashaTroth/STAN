import React from "react"
// --------------------------------------------------------------

function Exams() {
  // return ----------------
  return (
    <div className="exams">
      <div className="container-fluid">
        <div className="exams__headline">
          <h2>Current Exams</h2>
        </div>

        <div className="exams__container">
          <div className="exams__container__subject box-content">
            <div className="exams__container__subject--headline">
              <h4>Backend Development</h4>
            </div>
            <div className="exams__container__subject--current-status">
              <p>completed 20%</p>
            </div>
          </div>
          <div className="exams__container__subject box-content">
            <div className="exams__container__subject--headline">
              <h4>Math & Statistics</h4>
            </div>
            <div className="exams__container__subject--current-status">
              <p>completed 98%</p>
            </div>
          </div>
          <div className="exams__container__subject box-content">
            <div className="exams__container__subject--headline">
              <h4>Computer Networks</h4>
            </div>
            <div className="exams__container__subject--current-status">
              <p>completed 67%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Exams
