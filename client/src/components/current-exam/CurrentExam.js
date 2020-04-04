import React from "react"

// TODO: https://www.storyblok.com/tp/react-dynamic-component-from-json
// https://learnwithparam.com/blog/dynamic-pages-in-react-router/
function CurrentExam({ id, subject, currentStatus }) {
  return (
    <div className="exam">
      <div className="exam__subject box-content">
        <div className="exam__subject--headline">
          <h4>{subject}</h4>
        </div>
        <div className="exam__subject--current-status">
          <p>completed {currentStatus}%</p>
        </div>
      </div>
    </div>
  )
}

export default CurrentExam
