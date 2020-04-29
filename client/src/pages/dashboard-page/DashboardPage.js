import React, { Suspense, lazy, useState } from "react"
import { CurrentUserContext } from "../../components/STAN/STAN"
import { useQuery } from "@apollo/react-hooks"
import { CURRENT_USER, GET_TODAYS_CHUNKS } from "../../graphQL/queries"
// --------------------------------------------------------------

// components ----------------
import { GOOGLE_URL_AUTH_CODE_MUTATION } from "../../graphQL/mutations"

const EmptyDashboard = lazy(() =>
  import("../../components/empty-dashboard/EmptyDashboard")
)
const TodayGoals = lazy(() => import("../../components/today-goals/TodayGoals"))
const Today = lazy(() => import("../../components/today/Today"))
const Mascots = lazy(() => import("../../components/mascots/Mascots"))
const QueryError = lazy(() => import("../../components/error/Error"))
const Loading = lazy(() => import("../../components/loading/Loading"))
const CurrentState = lazy(() =>
  import("../../components/current-state/CurrentState")
)

function Dashboard() {
  // query ----------------
  const { loading, error } = useQuery(CURRENT_USER)
  const { chunkLoading, chunkError, data } = useQuery(GET_TODAYS_CHUNKS)
  const [activeElementIndex, setActiveElementIndex] = useState(0)

  // mascot trigger ----------------
  const mascot = window.localStorage.getItem("mascot-event")
  if (mascot === "true") {
    return <Mascots />
  }

  // error handling ----------------
  if (loading) return <Loading />
  if (error) return <QueryError errorMessage={error.message} />
  if (chunkLoading) return <Loading />
  if (chunkError) return <QueryError errorMessage={chunkError.message} />

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
      <Suspense fallback={<h1>loading…</h1>}>
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
      </Suspense>
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
