import React from "react"
import { useQuery } from "@apollo/react-hooks"
import { CURRENT_USER } from "../../graphQL/queries"
// --------------------------------------------------------------

// components ----------------
import EmptyDashboard from "../../components/empty-dashboard/EmptyDashboard"
import TodayGoals from "../../components/today-goals/TodayGoals"

function Dashboard() {
  // query ----------------
  const { loading, error, data } = useQuery(CURRENT_USER)
  // error handling ----------------
  if (loading) return <p>Loading...</p>
  if (error) return <p>Error :(</p>

  // return ----------------
  return (
    <div className="dashboard-page">
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-12">
            <h2 className="dashboard-page__heading">
              Hello
              {/* {data.currentUser.username} */}
            </h2>
            <p className="dashboard-page__current-date">{getCurrentDate()}</p>
          </div>
          {/* ------ no tasks ------*/}
          <div className="col-md-8">
            <EmptyDashboard></EmptyDashboard>
          </div>
          <div className="col-md-4"></div>
          {/* ------ if tasks open ------*/}
          <div className="col-md-4">
            <TodayGoals></TodayGoals>
          </div>
          <div className="col-md-8">{/* Today */}</div>
          <div className="col-md-4">{/* Today Progress */}</div>
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
