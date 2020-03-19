import React from "react"

function CurrentExam({ subject, currentStatus }) {
  return (
    <div className="exam">
      <div className="exam__subject box-content">
        <div className="exam__subject--headline">
          <h4>{subject}</h4>
        </div>
        <div className="exam__subject--current-status">
          <p>completed {currentStatus}</p>
        </div>
      </div>
    </div>
  )
}

export default CurrentExam
