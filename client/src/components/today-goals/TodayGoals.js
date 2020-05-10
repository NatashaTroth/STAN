import React from "react"
// --------------------------------------------------------------

// components ----------------
import TodaySubject from "../../components/today-subject/TodaySubject"

function TodayGoals(props) {
  // query data ----------------
  let todaySubject
  let totalDurationTime
  let totalDuration = 0

  // map entries ----------------
  todaySubject = props.data.map((element, index) => {
    // subject ----------------
    let subject = element.exam.subject

    // duration for 1 exam ----------------
    let duration = element.durationLeftToday
    let durationTime = calculateDuration(element.durationLeftToday)

    // duration for all exams total
    totalDuration += duration
    totalDurationTime = calculateDurationTotal(totalDuration)
    // console.log(element)
    // return ----------------
    return (
      <TodaySubject
        key={index}
        subject={subject}
        durationTime={durationTime}
        onClick={e => {
          e.preventDefault()
          props.activeElementIndexChange(index)
        }}
        className={props.activeIndex === index ? "active-subject" : undefined}
      ></TodaySubject>
    )
  })

  // return ----------------
  return (
    <div className="today-goals box-content">
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-12">
            <div className="today-goals__container">
              <div className="today-goals__container__header">
                <h3 className="today-goals__container__header__heading">
                  Today's Goals
                </h3>
                <p className="today-goals__container__header__time">
                  {totalDurationTime}
                </p>
              </div>
            </div>
            {/* Subjects */}
            {todaySubject}
            {/* ---------------- */}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TodayGoals

export function calculateDuration(duration) {
  let hours
  let minutes
  let durationTime

  // calculate duration display
  if (duration >= 60) {
    hours = Math.floor(duration / 60)
    minutes = Math.floor(duration) - hours * 60

    return (durationTime = hours + " hours " + minutes + " min")
  } else {
    minutes = duration
    return (durationTime = minutes + " min")
  }
}

export function calculateDurationTotal(totalDuration) {
  let hoursTotal
  let minutesTotal
  let totalDurationTime

  if (totalDuration >= 60) {
    hoursTotal = Math.floor(totalDuration / 60)
    minutesTotal = Math.floor(totalDuration) - hoursTotal * 60

    return (totalDurationTime = hoursTotal + "h " + minutesTotal + "m")
  } else {
    minutesTotal = totalDuration

    return (totalDurationTime = minutesTotal + "m")
  }
}
