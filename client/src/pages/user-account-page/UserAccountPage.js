import React from "react"
import { setAccessToken } from "../../accessToken"
import { GoogleLogout } from "react-google-login"
import { Redirect, Link } from "react-router-dom"
// --------------------------------------------------------------

// composer ----------------
import { flowRight as compose } from "lodash"
import { graphql } from "react-apollo"

// mutation & queries ----------------
import { useMutation } from "@apollo/react-hooks"
import { LOGOUT_MUTATION } from "../../graphQL/mutations"
import {
  GET_EXAMS_COUNT,
  GET_TODAYS_CHUNKS_PROGRESS,
  CURRENT_USER,
} from "../../graphQL/queries"

// libraries ----------------
import Carousel from "react-bootstrap/Carousel"
import CountUp from "react-countup"

// components ----------------
import QueryError from "../../components/error/Error"
import Loading from "../../components/loading/Loading"

// sub components ----------------
import Button from "../../components/button/Button"
import Image from "../../components/image/Image"

// apolloClient cache ----------------
import { client } from "../../apolloClient"

function UserAccount(props) {
  // mutation ----------------
  const [logout] = useMutation(LOGOUT_MUTATION)

  // redirects ----------------
  const currentUser = client.readQuery({ query: CURRENT_USER }).currentUser
  if (currentUser === null) {
    return <Redirect to="/login" />
  }

  // variables ----------------
  let currentExams = 0
  let finishedExams = 0
  let currentState = 0

  // error handling and get data ----------------
  if (props.loading) return <Loading />
  if (props.error) return <QueryError errorMessage={props.error.message} />
  if (props.getExamsQuery.examsCount) {
    for (let [key, value] of Object.entries(props.getExamsQuery.examsCount)) {
      if (key === "currentExams") currentExams = value
      else if (key === "finishedExams") finishedExams = value
    }
  }
  if (props.getTodaysChunksProgressQuery.todaysChunksProgress) {
    currentState = props.getTodaysChunksProgressQuery.todaysChunksProgress
  }

  // moods ----------------
  let mood = currentMood(currentState)

  // google logout ----------------
  const currentUserGoogleLogin = currentUser.googleLogin
  let logoutButton
  if (!currentUserGoogleLogin) {
    logoutButton = (
      <Button
        variant="button"
        className=""
        onClick={async () => logUserOut({ logout })}
        text="Logout"
      />
    )
  } else {
    logoutButton = (
      <GoogleLogout
        clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
        buttonText="Logout"
        onLogoutSuccess={async () => logUserOut({ logout, client })}
        render={renderProps => (
          <button
            variant="button"
            onClick={renderProps.onClick}
            disabled={renderProps.disabled}
          >
            Logout
          </button>
        )}
      />
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
              {currentUser.username.slice(-1) === "s" ? (
                <h2>{currentUser.username}' account</h2>
              ) : (
                <h2>{currentUser.username}'s account</h2>
              )}
            </div>
          </div>
          <div className="col-md-2"></div>
        </div>
      </div>

      <div className="container-fluid">
        <div className="row">
          <div className="col-md-1"></div>
          <div className="col-md-5">
            <div className="user-account__container--left">
              <div className="user-account__container--left--top box-content">
                <div className="user-data">
                  <h3>{currentUser.username}</h3>
                  <p>{currentUser.email}</p>
                </div>

                <div className="buttons">
                  <Link to="/profile/edit">edit</Link>
                  {logoutButton}
                </div>
              </div>

              <div className="user-account__container--left--bottom box-content">
                <div className="total-exam">
                  <CountUp
                    start={0}
                    end={currentExams}
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
                <Carousel indicators={false} controls={false}>
                  <Carousel.Item>
                    <Image
                      path={require(`../../images/mascots/${
                        currentUser.mascot
                      }-${mood.replace(/ /g, "")}-0.svg`)}
                      text=""
                    />
                  </Carousel.Item>

                  <Carousel.Item>
                    <Image
                      path={require(`../../images/mascots/${
                        currentUser.mascot
                      }-${mood.replace(/ /g, "")}-1.svg`)}
                      text=""
                    />
                  </Carousel.Item>

                  <Carousel.Item>
                    <Image
                      path={require(`../../images/mascots/${
                        currentUser.mascot
                      }-${mood.replace(/ /g, "")}-2.svg`)}
                      text=""
                    />
                  </Carousel.Item>
                </Carousel>
              </div>
            </div>
          </div>
          <div className="col-md-2"></div>
        </div>
      </div>
    </div>
  )
}

export default compose(
  graphql(GET_EXAMS_COUNT, {
    name: "getExamsQuery",
  }),
  graphql(GET_TODAYS_CHUNKS_PROGRESS, {
    name: "getTodaysChunksProgressQuery",
  })
)(UserAccount)

async function logUserOut({ logout }) {
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

export const currentMood = currentState => {
  let mood

  if (currentState >= 0 && currentState <= 19) mood = "very stressed"
  else if (currentState >= 20 && currentState <= 49) mood = "stressed"
  else if (currentState >= 50 && currentState <= 69) mood = "okay"
  else if (currentState >= 70 && currentState <= 89) mood = "happy"
  else if (currentState >= 90 && currentState <= 100) mood = "very happy"

  return mood
}
