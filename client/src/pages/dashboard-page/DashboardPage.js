import React, { useState } from "react"
import { Redirect } from "react-router-dom"
import {
  CurrentUserContext,
  useCurrentUserValue,
} from "../../components/STAN/STAN"
import { useQuery } from "@apollo/react-hooks"
import { GET_TODAYS_CHUNKS_AND_PROGRESS } from "../../graphQL/queries"
// --------------------------------------------------------------

// components ----------------
import EmptyDashboard from "../../components/empty-dashboard/EmptyDashboard"
import TodayGoals from "../../components/today-goals/TodayGoals"
import Today from "../../components/today/Today"
import Mascots from "../../components/mascots/Mascots"
import QueryError from "../../components/error/Error"
import Loading from "../../components/loading/Loading"
import CurrentState from "../../components/current-state/CurrentState"

function Dashboard() {
  // query ----------------
  const { loading, error, data } = useQuery(GET_TODAYS_CHUNKS_AND_PROGRESS)
  const [activeElementIndex, setActiveElementIndex] = useState(0)

  // redirects ----------------
  const currentUser = useCurrentUserValue()
  if (currentUser === undefined) {
    return <Redirect to="/login" />
  }

  // mascot trigger ----------------
  const mascot = window.localStorage.getItem("mascot-event")
  if (mascot === "true") {
    return <Mascots />
  }

  // error handling ----------------
  if (loading) return <Loading />
  if (error) return <QueryError errorMessage={error.message} />

  // query data ----------------
  let usersToDos

  // check if there is data ----------------
  if (data && data.todaysChunkAndProgress.todaysChunks.length > 0) {
    // filter only not completed entries ----------------
    let filteredItems = data.todaysChunkAndProgress.todaysChunks.filter(
      function(el) {
        return el.completed == false
      }
    )

    // exams to do ----------------
    if (filteredItems.length > 0) {
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
                data={data}
              ></TodayGoals>
            </div>
            <div className="col-xl-6 today-component-container">
              {/* Today */}
              <Today activeIndex={activeElementIndex} data={data}></Today>
            </div>
            <div className="col-xl-2">{/* Today Progress */}</div>
          </div>
        </div>
      )
    } else {
      // all done for today ----------------
      usersToDos = (
        <div className="container-fluid">
          <div className="row">
            {/* ------ no tasks ------*/}
            <div className="col-md-1"></div>
            <div className="col-md-7">
              <EmptyDashboard
                heading="No open tasks"
                text="You finished studying for today, come back tomorrow"
                showBtn="no"
              ></EmptyDashboard>
            </div>
            <div className="col-md-4"></div>
          </div>
        </div>
      )
    }
  } else {
    // no current exams ----------------
    usersToDos = (
      <div className="container-fluid">
        <div className="row">
          {/* ------ no tasks ------*/}
          <div className="col-md-1"></div>
          <div className="col-md-7">
            <EmptyDashboard
              heading="No open tasks"
              text="Are you sure there are no exams you need to study for?"
              showBtn="yes"
            ></EmptyDashboard>
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
        <div className="row dashboard-header">
          <div className="col-xl-1"></div>
          <div className="col-xl-7">
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
          <div className="col-xl-4">
            <CurrentState />
          </div>
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
