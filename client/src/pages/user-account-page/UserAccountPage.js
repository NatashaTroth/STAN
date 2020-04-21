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
import {
  GET_EXAMS_COUNT,
  GET_TODAYS_CHUNKS_PROGRESS,
} from "../../graphQL/queries"

// libraries ----------------
import CountUp from "react-countup"
import { Carousel } from "react-responsive-carousel"
import "react-responsive-carousel/lib/styles/carousel.min.css"

// components ----------------
import UserAccountEdit from "./UserAccountEdit"
import QueryError from "../../components/error/Error"

// sub components ----------------
import Button from "../../components/button/Button"
import Image from "../../components/image/Image"

function UserAccount() {
  // state ----------------
  const [edit, openEdit] = useState(false)

  // query ----------------
  const {
    data: dataExamsCount,
    error: errorExamsCount,
    loading: loadingExamsCount,
  } = useQuery(GET_EXAMS_COUNT)
  const {
    data: dataChunksProgress,
    error: errorChunksProgress,
    loading: loadingChunksProgress,
  } = useQuery(GET_TODAYS_CHUNKS_PROGRESS)

  // mutation ----------------
  const [logout, { client }] = useMutation(LOGOUT_MUTATION)

  // redirects ----------------
  const currentUser = useCurrentUserValue()
  if (currentUser === undefined) {
    return <Redirect to="/login" />
  }

  // count all exams ----------------
  let currentExams,
    finishedExams,
    todaysChunksProgress = 0

  // error handling and get data ----------------
  if (loadingExamsCount || loadingChunksProgress) return <p>loading...</p>
  if (errorExamsCount) {
    return <QueryError errorMessage={errorExamsCount.message} />
  }
  if (errorChunksProgress) {
    return <QueryError errorMessage={errorChunksProgress.message} />
  }
  if (dataExamsCount || dataChunksProgress) {
    currentExams = dataExamsCount.examsCount.currentExams
    finishedExams = dataExamsCount.examsCount.finishedExams
    todaysChunksProgress = dataChunksProgress.todaysChunksProgress
  }

  // moods ----------------
  let mood = "okay"

  if (todaysChunksProgress >= 0 && todaysChunksProgress <= 19)
    mood = "very stressed"
  else if (todaysChunksProgress >= 20 && todaysChunksProgress <= 49)
    mood = "stressed"
  else if (todaysChunksProgress >= 50 && todaysChunksProgress <= 69)
    mood = "okay"
  else if (todaysChunksProgress >= 70 && todaysChunksProgress <= 89)
    mood = "happy"
  else if (todaysChunksProgress >= 90 && todaysChunksProgress <= 100)
    mood = "very happy"

  // google logout ----------------
  const currentUserGoogleLogin = currentUser.googleLogin
  let logoutButton
  if (!currentUserGoogleLogin) {
    logoutButton = (
      <Button
        variant="button"
        className=""
        onClick={async () => logUserOut({ logout, client })}
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

  // functions ----------------
  const handleEdit = () => {
    openEdit(edit => !edit)
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

async function logUserOut({ logout, client }) {
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
