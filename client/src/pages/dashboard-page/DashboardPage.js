import React, { useState } from "react"
import { CurrentUserContext } from "../../components/STAN/STAN"
import { useQuery } from "@apollo/react-hooks"
import { CURRENT_USER, GET_TODAYS_CHUNKS } from "../../graphQL/queries"
// --------------------------------------------------------------

// components ----------------
import EmptyDashboard from "../../components/empty-dashboard/EmptyDashboard"
import TodayGoals from "../../components/today-goals/TodayGoals"
import Today from "../../components/today/Today"
import Mascots from "../../components/mascots/Mascots"
import QueryError from "../../components/error/Error"
import { GOOGLE_URL_AUTH_CODE_MUTATION } from "../../graphQL/mutations"

function Dashboard() {
  // query ----------------
  const { loading, error } = useQuery(CURRENT_USER)
  const { chunkLoading, chunkError, data } = useQuery(GET_TODAYS_CHUNKS)
  const [activeElementIndex, setActiveElementIndex] = useState(0)

  // mascot trigger
  const mascot = window.localStorage.getItem("mascot-event")
  if (mascot === "true") {
    return <Mascots />
  }

  // error handling ----------------
  if (loading) return <p>Loading...</p>
  if (error) return <QueryError errorMessage={error.message} />
  if (chunkLoading) return <p className="loading">Loading...</p>
  if (chunkError) return <QueryError />

  // query data ----------------
  let usersToDos

  if (data && data.todaysChunks.length > 0) {
    usersToDos = (
      <div className="container-fluid">
        <div className="row">
          {/* ------ if tasks open ------*/}
          <div className="col-xl-1"></div>
          <div className="col-xl-3">
            {/* Today Goals*/}
            <TodayGoals
              activeElementIndexChange={index => {
                setActiveElementIndex(index)
              }}
              activeIndex={activeElementIndex}
            ></TodayGoals>
          </div>
          <div className="col-xl-6 today-component-container">
            {/* Today */}
            <Today activeIndex={activeElementIndex}></Today>
          </div>
          <div className="col-xl-2">{/* Today Progress */}</div>
        </div>
      </div>
    )
  } else {
    usersToDos = (
      <div className="container-fluid">
        <div className="row">
          {/* ------ no tasks ------*/}
          <div className="col-md-1"></div>
          <div className="col-md-7">
            <EmptyDashboard></EmptyDashboard>
          </div>
          <div className="col-md-4"></div>
        </div>
      </div>
    )
  }

  // return ----------------
  return (
    <div className="dashboard-page">
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-1"></div>
          <div className="col-md-5">
            <CurrentUserContext.Consumer>
              {currentUser => (
                <h2 className="dashboard-page__heading">
                  Hello {currentUser.username}
                </h2>
              )}
            </CurrentUserContext.Consumer>
            <p className="dashboard-page__current-date">{getCurrentDate()}</p>
          </div>
          {/* Mascot */}
          <div className="col-md-5">
            {/* <CurrentUserContext.Consumer>
              {currentUser => (
                <img
                  src={require(`../../images/mascots/user-mascot/${currentUser.mascot}-0.svg`)}
                  alt=""
                />
              )}
            </CurrentUserContext.Consumer> */}
          </div>
          <div className="col-md-1"></div>
        </div>
      </div>
      {/* dashboard content */}
      {usersToDos}
      {/* ---------------- */}
    </div>
  )
}

export default Dashboard

function getCurrentDate() {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ]

  let today = new Date()
  let date =
    days[today.getDay()] +
    ", " +
    today.getDate() +
    ". " +
    monthNames[today.getMonth() + 1] +
    " " +
    today.getFullYear()

  return date
}
