import React from "react"
// --------------------------------------------------------------

// components ----------------
import TodaySubject from "../../components/today-subject/TodaySubject"

function TodayGoals(props) {
  // query data ----------------
  let subject
  let todaySubject
  let duration
  let durationTime
  let hours
  let minutes
  let totalDuration = 0
  let totalDurationTime
  let hoursTotal
  let minutesTotal

  if (props.data && props.data.todaysChunkAndProgress.todaysChunks.length > 0) {
    // filter only not completed entries
    let filteredItems = props.data.todaysChunkAndProgress.todaysChunks.filter(
      function(el) {
        return el.completed == false
      }
    )
    // map entries
    todaySubject = filteredItems.map((element, index) => {
      subject = element.exam.subject
      duration = element.durationToday
      totalDuration += duration

      if (duration >= 60) {
        hours = Math.floor(duration / 60)
        minutes = Math.floor(duration) - hours * 60
        durationTime = hours + " hours " + minutes + " min"

        hoursTotal = Math.floor(totalDuration / 60)
        minutesTotal = Math.floor(totalDuration) - hoursTotal * 60
        totalDurationTime = hoursTotal + "h " + minutesTotal + "m"
      } else {
        minutes = duration
        durationTime = minutes + " min"

        minutesTotal = totalDuration
        totalDurationTime = minutesTotal + "m"
      }

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
  }

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
