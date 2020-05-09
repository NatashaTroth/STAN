import React from "react"
import moment from "moment"
// --------------------------------------------------------------

// sub-components ----------------
import ExamBar from "../progressbar/ProgressBar"

// helpers functions ----------------
import { getNumberOfDays, minuteToHours } from "../../helpers/dates"

const ExamDetailsInfo = ({ examDetails }) => {
  // calculation ----------------
  const today = new Date()

  const todaysDayUntilDeadline = getNumberOfDays(
    today,
    new Date(examDetails.examDate)
  )

  console.log(examDetails)

  // return ----------------
  return (
    <div className="exam-details__inner--details">
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-4">
            <div className="exam-details__inner--details--left">
              <div className="exam-data">
                <h4>Exam date</h4>
                <p>{moment(examDetails.examDate).format("DD.MM.YYYY")}</p>
              </div>

              <div className="exam-data">
                <h4>Start learning on</h4>
                <p>{moment(examDetails.startDate).format("DD.MM.YYYY")}</p>
              </div>

              <div className="exam-data">
                <h4>Amount of pages</h4>
                <p>{examDetails.numberPages}</p>
              </div>

              <div className="exam-data">
                <h4>Time per pages</h4>
                <p>{minuteToHours(examDetails.timePerPage)}</p>
              </div>

              <div className="exam-data">
                <h4>Repeat</h4>
                {examDetails.timesRepeat > 1 ? (
                  <p>{examDetails.timesRepeat} times</p>
                ) : (
                  <p>{examDetails.timesRepeat} time</p>
                )}
              </div>
            </div>
          </div>

          <div className="col-md-8">
            <div className="exam-details__inner--details--right">
              <div className="exam-data">
                <h4>Days until deadline</h4>
                <p>{todaysDayUntilDeadline} days left</p>
              </div>
              <div className="exam-data">
                <h4>Studied</h4>
                <p>
                  {(
                    (100 * (examDetails.currentPage - 1)) /
                    (examDetails.numberPages * examDetails.timesRepeat)
                  ).toFixed(2)}
                  % of 100%
                </p>
              </div>
              <div className="exam-pages">
                <h4>Pages left</h4>

                <div className="exam-pages__bar">
                  <ExamBar
                    value={
                      (100 * (examDetails.currentPage - 1)) /
                      examDetails.numberPages
                    }
                  />

                  <div className="exam-pages__bar--status">
                    <p>
                      {Math.round(
                        examDetails.numberPages - (examDetails.currentPage - 1)
                      )}{" "}
                      pages left
                    </p>
                  </div>
                </div>
              </div>
              <div className="exam-data">
                <h4>Pages studied</h4>
                <p>
                  {examDetails.currentPage - 1}/{examDetails.numberPages}
                </p>
              </div>

              <div className="exam-data">
                <h4>Repetition cycle</h4>
                <p>1/{examDetails.timesRepeat}</p>
              </div>

              <div className="pdf">
                <div className="pdf--file">
                  <h4>PDF file</h4>

                  <p>{examDetails.pdfLink}</p>
                </div>
                <a
                  href={examDetails.pdfLink}
                  // target="_blank"
                  className="stan-btn-secondary"
                >
                  open
                </a>
              </div>
            </div>
          </div>
          <div className="col-md-12">
            <div className="exam-details__inner--details--bottom">
              <h4>Notes</h4>

              <div className="notes">
                {!examDetails.notes ? <p>...</p> : <p>{examDetails.notes}</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ExamDetailsInfo
