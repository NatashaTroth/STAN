import React, { useState } from "react"
import { setAccessToken } from "../../accessToken"
import { GoogleLogout } from "react-google-login"
// --------------------------------------------------------------

// context ----------------
import {
  CurrentUserContext,
  useCurrentUserValue,
} from "../../components/STAN/STAN"

// mutation & queries ----------------
import { useHistory, Redirect } from "react-router-dom"
import { useMutation, useQuery } from "@apollo/react-hooks"
import { LOGOUT_MUTATION } from "../../graphQL/mutations"
import { GET_EXAMS_QUERY, GET_TODAYS_CHUNKS } from "../../graphQL/queries"

// libraries ----------------
import CountUp from "react-countup"
import { Carousel } from "react-responsive-carousel"
import "react-responsive-carousel/lib/styles/carousel.min.css"

// components ----------------
import UserAccountEdit from "./UserAccountEdit"

// sub components ----------------
import Button from "../../components/button/Button"
import Image from "../../components/image/Image"

function UserAccount() {
  // history ----------------
  const history = useHistory()

  const [edit, openEdit] = useState(false)

  // query ----------------
  // TODO: fetch only one query per component
  const { data, error, loading } = useQuery(GET_TODAYS_CHUNKS)
  const {
    data: examsData,
    error: examsError,
    loading: examsLoading,
  } = useQuery(GET_EXAMS_QUERY)

  // mutation ----------------
  const [logout, { client }] = useMutation(LOGOUT_MUTATION)

  // redirects ----------------
  const currentUser = useCurrentUserValue()
  if (currentUser === undefined) {
    return <Redirect to="/login" />
  }

  // functions ----------------
  const handleEdit = () => {
    openEdit(edit => !edit)
  }

  // get and count all exams and todays chunks ----------------
  let totalExams,
    finishedExams = 0
  let completedDuration = []

  if (loading || examsLoading) return <p className="loading">loading...</p>
  if (error || examsError) return <p>error...</p>
  if (data || examsData) {
    totalExams = examsData.exams.length

    data.todaysChunks.forEach(exam => {
      // get all durations ----------------
      completedDuration.push(exam.duration)
    })

    examsData.exams.forEach(exam => {
      // count finished exams ----------------
      if (exam.completed) {
        finishedExams++
      }
    })
  }

  // sum up all durations ----------------
  const totalSum = completedDuration.reduce(
    (previousDuration, currentDuration) => previousDuration + currentDuration,
    0
  )

  // moods ----------------
  // TODO: dynamic! currentState sollte zwischen 0 - 100 sein
  let mood = "okay"
  let currentState = 101

  if (currentState >= 0 && currentState <= 19) mood = "very stressed"
  else if (currentState >= 20 && currentState <= 49) mood = "stressed"
  else if (currentState >= 50 && currentState <= 69) mood = "okay"
  else if (currentState >= 70 && currentState <= 89) mood = "happy"
  else if (currentState >= 90 && currentState <= 100) mood = "very happy"

  // google logout ----------------
  const currentUserGoogleLogin = currentUser.googleLogin
  let logoutButton
  if (!currentUserGoogleLogin) {
    logoutButton = (
      <Button
        variant="button"
        className=""
        onClick={async () => logUserOut({ logout, client, history })}
        text="Logout"
      />
    )
  } else {
    logoutButton = (
      <GoogleLogout
        clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
        buttonText="Logout"
        onLogoutSuccess={async () => logUserOut({ logout, client, history })}
        render={renderProps => (
          <button
            variant="button"
            onClick={renderProps.onClick}
            disabled={renderProps.disabled}
          >
            Logout
          </button>
        )}
      ></GoogleLogout>
    )
  }

  // return ----------------
  return (
    <div className="user-account">
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-1"></div>
          <div className="col-md-9">
            <div className="user-account__headline">
              <CurrentUserContext.Consumer>
                {currentUser => {
                  let username = currentUser.username
                  if (username.slice(-1) === "s") {
                    return <h2>{username}' account</h2>
                  } else {
                    return <h2>{username}'s account</h2>
                  }
                }}
              </CurrentUserContext.Consumer>
            </div>
          </div>
          <div className="col-md-2"></div>
        </div>
      </div>

      {edit ? (
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-1"></div>
            <div className="col-lg-9">
              <UserAccountEdit />
            </div>
            <div className="col-lg-2"></div>
          </div>
        </div>
      ) : (
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-1"></div>
            <div className="col-md-5">
              <div className="user-account__container--left">
                <div className="user-account__container--left--top box-content">
                  <div className="user-data">
                    <CurrentUserContext.Consumer>
                      {currentUser => <h3>{currentUser.username}</h3>}
                    </CurrentUserContext.Consumer>

                    <CurrentUserContext.Consumer>
                      {currentUser => <p>{currentUser.email}</p>}
                    </CurrentUserContext.Consumer>
                  </div>

                  <div className="buttons">
                    <Button variant="button" text="edit" onClick={handleEdit} />
                    {logoutButton}
                  </div>
                </div>

                <div className="user-account__container--left--bottom box-content">
                  <div className="total-exam">
                    <CountUp
                      start={0}
                      end={totalExams}
                      duration={2.75}
                      delay={0.5}
                    />
                    <p>
                      total exams <br /> to study
                    </p>
                  </div>

                  <div className="finished-exam">
                    <CountUp
                      start={0}
                      end={finishedExams}
                      duration={2.75}
                      delay={0.5}
                    />
                    <p>exams finished</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="user-account__container--right">
                <div className="user-account__container--right--top box-content">
                  <h4>current state:</h4>
                  <p>{mood}</p>
                </div>

                <div className="user-account__container--right--bottom box-content">
                  <Carousel
                    showStatus={false}
                    showThumbs={false}
                    infiniteLoop={true}
                    showIndicators={false}
                    autoPlay={true}
                    showArrows={false}
                  >
                    <CurrentUserContext.Consumer>
                      {currentUser => (
                        <Image
                          path={require(`../../images/mascots/${
                            currentUser.mascot
                          }-${mood.replace(/ /g, "")}-0.svg`)}
                          text=""
                        />
                      )}
                    </CurrentUserContext.Consumer>

                    <CurrentUserContext.Consumer>
                      {currentUser => (
                        <Image
                          path={require(`../../images/mascots/${
                            currentUser.mascot
                          }-${mood.replace(/ /g, "")}-1.svg`)}
                          text=""
                        />
                      )}
                    </CurrentUserContext.Consumer>

                    <CurrentUserContext.Consumer>
                      {currentUser => (
                        <Image
                          path={require(`../../images/mascots/${
                            currentUser.mascot
                          }-${mood.replace(/ /g, "")}-2.svg`)}
                          text=""
                        />
                      )}
                    </CurrentUserContext.Consumer>
                  </Carousel>
                </div>
              </div>
            </div>
            <div className="col-md-2"></div>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserAccount

async function logUserOut({ logout, client, history }) {
  // reset refresh token ----------------
  await logout()

  // reset access token ----------------
  setAccessToken("")

  // reset mascot event ----------------
  window.localStorage.setItem("mascot-event", false)

  // logout all other tabs ----------------
  localStorage.setItem("logout-event", Date.now())
  window.location.reload()
}
