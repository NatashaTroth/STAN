import React, { useState } from "react"
import { useQuery } from "@apollo/react-hooks"
import { GET_TODAYS_CHUNKS } from "../../graphQL/queries"
// --------------------------------------------------------------

// components ----------------
import TodaySubject from "../../components/today-subject/TodaySubject"

function TodayGoals() {
  // query ----------------
  const { loading, error, data } = useQuery(GET_TODAYS_CHUNKS)
  const [activeElementIndex, setActiveElementIndex] = useState(0)

  // error handling ----------------
  if (loading) return <p>Loading...</p>
  if (error) return <p>Error :(</p>

  // query data ----------------
  let subject
  let duration
  let todaySubject

  if (data) {
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
            setActiveElementIndex(index)
          }}
          className={
            index === activeElementIndex ? "active-subject" : undefined
          }
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
