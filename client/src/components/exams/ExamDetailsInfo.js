import React from "react"
import moment from "moment"
// --------------------------------------------------------------

// sub-components ----------------
import ExamBar from "../progressbar/ProgressBar"

// helpers functions ----------------
import { getNumberOfDays, minuteToHours } from "../../helpers/dates"
import { extractDomain } from "../../helpers/mascots"

const ExamDetailsInfo = ({ examDetails }) => {
  // calculation ----------------
  const today = new Date()

  const todaysDayUntilDeadline = getNumberOfDays(
    today,
    new Date(examDetails.examDate)
  )

  let lastPage = examDetails.startPage + (examDetails.numberPages - 1)
  let currentRepetition = Math.round(examDetails.currentPage / lastPage)
  if (currentRepetition < 1) currentRepetition = 1
  let links = examDetails.studyMaterialLinks

  // return ----------------
  return (
    <div className="exam-details__inner--details">
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-4">
            <div className="exam-details__inner--details--left">
              <div className="exam-data">
                <h4>Exam date</h4>
                <p>{moment(examDetails.examDate).format("DD/MM/YYYY")}</p>
              </div>

              <div className="exam-data">
                <h4>Start learning on</h4>
                <p>{moment(examDetails.startDate).format("DD/MM/YYYY")}</p>
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
                  {Math.round(
                    (100 * (examDetails.currentPage - 1)) /
                      (examDetails.numberPages * examDetails.timesRepeat)
                  )}
                  % of 100%
                </p>
              </div>
              <div className="exam-pages">
                <h4>Pages left incl. repetition</h4>

                <div className="exam-pages__bar">
                  <ExamBar
                    value={
                      (100 * (examDetails.currentPage - 1)) /
                      (examDetails.numberPages * examDetails.timesRepeat)
                    }
                  />

                  <div className="exam-pages__bar--status">
                    <p>
                      {Math.round(
                        examDetails.numberPages * examDetails.timesRepeat -
                          (examDetails.currentPage - 1)
                      )}{" "}
                      pages left
                    </p>
                  </div>
                </div>
              </div>

              <div className="exam-data">
                <h4>Repetition cycle</h4>
                <p>
                  {currentRepetition}/{examDetails.timesRepeat}
                </p>
              </div>

              <div className="link">
                <div className="link--headline">
                  <h4>Study material links</h4>
                </div>
                <div className="link--buttons">
                  {links.map((value, index) => (
                    <div key={index}>
                      <a
                        href={value}
                        target="_blank"
                        className="stan-btn-secondary"
                      >
                        {extractDomain(value)}
                      </a>
                    </div>
                  ))}
                </div>
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
