import React from "react"
import { setAccessToken } from "../../accessToken"
import { GoogleLogout } from "react-google-login"
// --------------------------------------------------------------

// mutation & queries
import { useHistory } from "react-router-dom"
import { useMutation, useQuery } from "@apollo/react-hooks"
import { LOGOUT_MUTATION } from "../../graphQL/mutations"
import { CURRENT_USER } from "../../graphQL/queries"

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
  // query ----------------
  //TODO: current user vom store holen
  const { data, loading } = useQuery(CURRENT_USER)
  let currentUserLoaded = false

  if (!loading && data && data.currentUser) {
    currentUserLoaded = true
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
          <div className="col-md-11">
            <div className="user-account__headline">
              {currentUserLoaded ? (
                <h2> {data.currentUser.username}'s account</h2>
              ) : null}
            </div>

            <div className="user-account__container">
              <div className="col-md-6 user-account__container--left">
                <div className="user-account__container--left--top box-content">
                  <div className="user-account__container--left--top--user-data">
                    <div className="user-data">
                      {currentUserLoaded ? (
                        <h3>{data.currentUser.username}</h3>
                      ) : null}

                      {currentUserLoaded ? (
                        <p>{data.currentUser.email}</p>
                      ) : null}
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

              <div className="col-md-5 user-account__container--right">
                <div className="user-account__container--right--top box-content">
                  <h4>current state:</h4>
                  <p>okay</p>
                </div>

                <div className="user-account__container--right--bottom box-content">
                  {currentUserLoaded ? (
                    <Carousel
                      showStatus={false}
                      showThumbs={false}
                      infiniteLoop={true}
                      showIndicators={false}
                      autoPlay={true}
                      showArrows={false}
                    >
                      <img
                        src={require(`../../images/mascots/user-mascot/${data.currentUser.mascot}-0.svg`)}
                        alt=""
                      />
                      <img
                        src={require(`../../images/mascots/user-mascot/${data.currentUser.mascot}-1.svg`)}
                        alt=""
                      />
                      <img
                        src={require(`../../images/mascots/user-mascot/${data.currentUser.mascot}-2.svg`)}
                        alt=""
                      />
                    </Carousel>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
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
          //TODO: DELETE IF APOLLO STORE IS NOT BEING USED
          await client.resetStore()
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

  //logout all other tabs
  localStorage.setItem("logout-event", Date.now())
  //resçlo client- always good after logout
  //TODO: DELETE IF APOLLO STORE IS NOT BEING USED
  await client.resetStore()
  history.push("/login")
  window.location.reload()
}
