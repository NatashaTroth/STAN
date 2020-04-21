import React from "react"
import { useQuery } from "@apollo/react-hooks"
import { GET_TODAYS_CHUNKS } from "../../graphQL/queries"
// --------------------------------------------------------------

// components ----------------
import TodaySubject from "../../components/today-subject/TodaySubject"
import QueryError from "../error/Error"
import Loading from "../loading/Loading"

function TodayGoals(props) {
  // query ----------------
  const { loading, error, data } = useQuery(GET_TODAYS_CHUNKS)

  // error handling ----------------
  if (loading) return <Loading />
  if (error) return <QueryError errorMessage={error.message} />

  // query data ----------------
  let subject
  let duration
  let todaySubject

  if (data && data.todaysChunks.length > 0) {
    todaySubject = data.todaysChunks.map((element, index) => {
      subject = element.exam.subject
      duration = element.duration

      return (
        <TodaySubject
          key={index}
          subject={subject}
          durationTime={duration + " min"}
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
                <p className="today-goals__container__header__time">2:30h</p>
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

// function subjectEventClickHandler(event) {
//   if (event.currentTarget.classList.value === "today-subject active-subject") {
//     event.currentTarget.classList.remove("active-subject")
//   } else {
//     event.currentTarget.classList.add("active-subject")
//   }
// }
