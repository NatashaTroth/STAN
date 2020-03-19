import React, { useState } from "react"
// --------------------------------------------------------------

// components
import CurrentExam from "../../components/current-exam/CurrentExam"

// sub components
import Button from "../../components/button/Button"

// TODO: Add query to loop through all exams
function Exams() {
  const [isArchiveOpen, setArchive] = useState(false)

  const handleButtonClick = () => {
    setArchive(!isArchiveOpen)
  }

  console.log(isArchiveOpen)
  // return ----------------
  return (
    <div className="exams">
      <div className="container-fluid">
        <div className="exams__headline">
          <h2>Current Exams</h2>
        </div>

        <div className="current-exams">
          <CurrentExam subject="Backend Development" currentStatus="68%" />
          <CurrentExam subject="Programming" currentStatus="81%" />
          <CurrentExam subject="Business English" currentStatus="37%" />
        </div>

        <Button variant="button" click={handleButtonClick} text="Past exams" />

        <div className="archive-exams">
          <CurrentExam subject="Computer Networks" currentStatus="67%" />
          <CurrentExam subject="Math Statistics" currentStatus="98%" />
          <CurrentExam subject="Multimedia" currentStatus="43%" />
        </div>
      </div>
    </div>
  )
}

export default Exams
