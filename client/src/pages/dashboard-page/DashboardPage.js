import React, { useState, useEffect } from "react"

import { useQuery, useMutation } from "@apollo/react-hooks"
import { CURRENT_USER } from "../../graphQL/queries"
// --------------------------------------------------------------

// components ----------------
import EmptyDashboard from "../../components/empty-dashboard/EmptyDashboard"
import TodayGoals from "../../components/today-goals/TodayGoals"
import { GOOGLE_URL_AUTH_CODE_MUTATION } from "../../graphQL/mutations"

// async function handleGoogleLogin({
//   googleAuthUrlCodeMutation,
//   googleAuthUrlCode,
// }) {
//   try {
//     //TODO: https://oauth2.example.com/auth?error=access_denied
//     const resp = await googleAuthUrlCodeMutation({
//       variables: {
//         code: googleAuthUrlCode,
//       },
//     })

//     if (resp && resp.data) {
//       console.log(resp)
//       // setAccessToken(resp.data.login.accessToken)
//     } else {
//       // displays server error (backend)
//       throw new Error("The login failed")
//     }
//     // redirect
//     // history.push("/")
//     // window.location.reload()
//   } catch (err) {
//     //TODO-AUTH: USER DEN ERROR MITTEILEN
//     console.error(err.message)
//     // console.log(err)
//   }
// }

function Dashboard() {
  // query ----------------
  const { loading, error, data } = useQuery(CURRENT_USER)
  // const [
  //   googleAuthUrlCodeMutation,
  //   { googleAuthUrlCodeMutationData },
  // ] = useMutation(GOOGLE_URL_AUTH_CODE_MUTATION)
  // useEffect(() => {
  //   console.log("in useeffect")
  //   let search = window.location.search
  //   let params = new URLSearchParams(search)
  //   let googleAuthUrlCode = params.get("code")
  //   if (params.get("code"))
  //     handleGoogleLogin({ googleAuthUrlCodeMutation, googleAuthUrlCode })
  //   //TODO: DON'T REDIRECT WHEN GOOGLE SUCCESSFULLY LOGGED IN - WOULD NEED REDIRECT HERE - WOULD NEED TO FIRST CHECK IF LOGGED IN AND IF CODE IN URL
  // }, [])

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
              Hello you
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
