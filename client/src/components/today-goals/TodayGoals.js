import React from "react"
import { useQuery } from "@apollo/react-hooks"
import { GET_USERS_QUERY } from "../../graphQL/queries"
// --------------------------------------------------------------

// components ----------------
import TodaySubject from "../../components/today-subject/TodaySubject"
import QueryError from "../error/Error"
import Loading from "../loading/Loading"

function TodayGoals(props) {
  // query ----------------
  const { loading, error } = useQuery(GET_USERS_QUERY)

  // // error handling ----------------
  if (loading) return <Loading />
  if (error) return <QueryError errorMessage={error.message} />

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

  if (props.data && props.data.todaysChunks.length > 0) {
    todaySubject = props.data.todaysChunks.map((element, index) => {
      subject = element.exam.subject
      duration = element.duration
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
                  Todays Goals
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
