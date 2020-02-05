import React, { useState } from "react"
import { useQuery } from "@apollo/react-hooks"
import { GET_USERS_QUERY } from "../../graphQL/queries"
// --------------------------------------------------------------

// components ----------------
import TodaySubject from "../../components/today-subject/TodaySubject"

function TodayGoals() {
  // query ----------------
  const { loading, error, data } = useQuery(GET_USERS_QUERY)

  // error handling ----------------
  if (loading) return <p>Loading...</p>
  if (error) return <p>Error :(</p>

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
            {/* LOOP through each task */}
            {/* on click check if class is set */}
            <TodaySubject
              subject="Computer Networking"
              durationTime="20 min"
              onClick={e => {
                e.preventDefault()
                subjectEventClickHandler(e)
              }}
            ></TodaySubject>
            <TodaySubject
              subject="Business English"
              durationTime="60 min"
              onClick={e => {
                e.preventDefault()
                subjectEventClickHandler(e)
              }}
            ></TodaySubject>
            <TodaySubject
              subject="Multimedia"
              durationTime="40 min"
              onClick={e => {
                e.preventDefault()
                subjectEventClickHandler(e)
              }}
            ></TodaySubject>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TodayGoals

function subjectEventClickHandler(event) {
  if (event.currentTarget.classList.value === "today-subject active-subject") {
    event.currentTarget.classList.remove("active-subject")
  } else {
    event.currentTarget.classList.add("active-subject")
  }
}
