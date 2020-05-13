import React from "react"
import { minuteToHours, minuteToHoursShort } from "../../helpers/dates"
// --------------------------------------------------------------

// components ----------------
import Listing from "../listing/Listing"

function TodayProgress(props) {
  // query data ----------------
  let todaySubject
  console.log(props.data)
  // map entries ----------------
  todaySubject = props.data.map((element, index) => {
    // subject ----------------
    let subject = element.exam.subject
    console.log(subject)
    // return ----------------
    return (
      <Listing
        key={index}
        text={subject}
        className={"today-progress__container__subjects__item"}
      ></Listing>
    )
  })

  // return ----------------
  return (
    <div className="today-progress box-content">
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-12">
            <div className="today-progress__container">
              <h3 className="today-progress__container__heading">
                Today's Progress
              </h3>
              {/* Pie/Circle Chart */}
              <div className="today-progress__container__chart">pie chart</div>
              {/* Subjects */}
              <div className="today-progress__container__subjects">
                {todaySubject}
              </div>
              {/* ---------------- */}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TodayProgress
