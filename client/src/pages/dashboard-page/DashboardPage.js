import React from "react"

import { useQuery } from "@apollo/react-hooks"
import { CURRENT_USER } from "../../graphQL/queries"
// --------------------------------------------------------------

// components ----------------
import EmptyDashboard from "../../components/empty-dashboard/EmptyDashboard"
import TodayGoals from "../../components/today-goals/TodayGoals"
import Today from "../../components/today/Today"
import { GOOGLE_URL_AUTH_CODE_MUTATION } from "../../graphQL/mutations"

function Dashboard() {
  // query ----------------
  const { loading, error } = useQuery(CURRENT_USER)

  // error handling ----------------
  if (loading) return <p>Loading...</p>
  if (error) return <p>Error :(</p>

  // return ----------------
  return (
    <div className="dashboard-page">
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-1"></div>
          <div className="col-md-10">
            <h2 className="dashboard-page__heading">
              Hello you
              {/* {data.currentUser.username} */}
            </h2>
            <p className="dashboard-page__current-date">{getCurrentDate()}</p>
          </div>
          <div className="col-md-1"></div>
          {/* ------ no tasks ------*/}
          <div className="col-md-1"></div>
          <div className="col-md-7">
            <EmptyDashboard></EmptyDashboard>
          </div>
          <div className="col-md-4"></div>
          {/* ------ if tasks open ------*/}
          <div className="col-xl-1"></div>
          <div className="col-xl-3">
            {/* Today Goals*/}
            <TodayGoals></TodayGoals>
          </div>
          <div className="col-xl-6">
            {/* Today */}
            <Today></Today>
          </div>
          <div className="col-xl-2">{/* Today Progress */}</div>
        </div>
      </div>
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
