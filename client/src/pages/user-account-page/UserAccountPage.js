import React, { useEffect } from "react"
import { setAccessToken } from "../../accessToken"
import { GoogleLogout } from "react-google-login"
// --------------------------------------------------------------

// context
import {
  CurrentUserContext,
  useCurrentUserValue,
} from "../../components/STAN/STAN"

// mutation & queries
import { useHistory, Redirect } from "react-router-dom"
import { useMutation } from "@apollo/react-hooks"
import { LOGOUT_MUTATION } from "../../graphQL/mutations"

// libraries
import CountUp from "react-countup"
import { Carousel } from "react-responsive-carousel"
import "react-responsive-carousel/lib/styles/carousel.min.css"

// sub components
import Button from "../../components/button/Button"

function UserAccount() {
  const history = useHistory()
  // mutation ----------------
  const [logout, { client }] = useMutation(LOGOUT_MUTATION)

  const currentUser = useCurrentUserValue()

  if (currentUser === undefined) {
    return <Redirect to="/login" />
  }

  // google login ----------------
  //TODO: CHANGE WHEN CURRENT USER IN STORE - MAKE DYNAMIC - DOESN'T WORK PROPERLY WHEN QUERY CURRENT USER HERE
  const currentUserGoogleLogin = false
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
        // render={renderProps => (
        //   <button
        //     onClick={renderProps.onClick}
        //     disabled={renderProps.disabled}
        //     className="stan-btn-primary"
        //   >
        //     Logout
        //   </button>
        // )}
      ></GoogleLogout>
    )
  }

  // return ----------------
  return (
    <div className="user-account">
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-1"></div>
          <div className="col-md-10">
            <div className="user-account__headline">
              <CurrentUserContext.Consumer>
                {currentUser => <h2>{currentUser.username}'s account</h2>}
              </CurrentUserContext.Consumer>
            </div>

            <div className="user-account__container">
              <div className="user-account__container--left">
                <div className="user-account__container--left--top box-content">
                  <div className="user-account__container--left--top--user-data">
                    <div className="user-data">
                      <CurrentUserContext.Consumer>
                        {currentUser => <h3>{currentUser.username}</h3>}
                      </CurrentUserContext.Consumer>

                      <CurrentUserContext.Consumer>
                        {currentUser => <p>{currentUser.email}</p>}
                      </CurrentUserContext.Consumer>
                    </div>
                  </div>

                  <div className="user-account__container--left--top--buttons">
                    <Button variant="button" text="edit" />
                    {logoutButton}
                  </div>
                </div>

                <div className="user-account__container--left--bottom box-content">
                  <div className="total-exam">
                    <CountUp start={0} end={10} duration={2.75} delay={0.5} />
                    <p>
                      total exams <br /> to study
                    </p>
                  </div>

                  <div className="finished-exam">
                    <CountUp start={0} end={2} duration={2.75} delay={0.5} />
                    <p>exams finished</p>
                  </div>
                </div>
              </div>

              <div className="user-account__container--right">
                <div className="user-account__container--right--top box-content">
                  <h4>current state:</h4>
                  <p>okay</p>
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
                        <img
                          src={require(`../../images/mascots/user-mascot/${currentUser.mascot}-0.svg`)}
                          alt=""
                        />
                      )}
                    </CurrentUserContext.Consumer>

                    <CurrentUserContext.Consumer>
                      {currentUser => (
                        <img
                          src={require(`../../images/mascots/user-mascot/${currentUser.mascot}-1.svg`)}
                          alt=""
                        />
                      )}
                    </CurrentUserContext.Consumer>

                    <CurrentUserContext.Consumer>
                      {currentUser => (
                        <img
                          src={require(`../../images/mascots/user-mascot/${currentUser.mascot}-2.svg`)}
                          alt=""
                        />
                      )}
                    </CurrentUserContext.Consumer>
                  </Carousel>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-1"></div>
        </div>
      </div>

      {/* <button
        onClick={async () => {
          //reset refresh token
          await logout()
          //reset access token
          setAccessToken("")

          //logout all other tabs
          // localStorage.setItem("logout-event", Date.now())

          //resçlo client- always good after logout
          history.push("/login")
          window.location.reload()
        }}
      >
        Logout
      </button> */}
    </div>
  )
}

export default UserAccount

async function logUserOut({ logout, client, history }) {
  //reset refresh token
  await logout()
  //reset access token
  setAccessToken("")

  // reset sign up trigger
  window.localStorage.setItem("setMascot", false)

  //logout all other tabs
  localStorage.setItem("logout-event", Date.now())
  //resçlo client- always good after logout
  window.location.reload()
}
