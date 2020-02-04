import React from "react"
import { useQuery } from "@apollo/react-hooks"
import { GET_USERS_QUERY } from "../../graphQL/queries"
import { getNamedType } from "graphql"
// --------------------------------------------------------------

function Dashboard() {
  // query ----------------
  const { loading, error, data } = useQuery(GET_USERS_QUERY)

  // error handling ----------------
  if (loading) return <p>Loading...</p>
  if (error) return <p>Error :(</p>

  // return ----------------
  return (
    <div className="dashboard-page">
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-12">
            <h2 className="dashboard-page__heading">Hello Lucy</h2>
            <p className="dashboard-page__current-date">{getCurrentDate()}</p>
          </div>
          <div className="col-md-12"></div>
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
