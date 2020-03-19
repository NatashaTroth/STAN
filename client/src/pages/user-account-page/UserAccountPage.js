import React from "react"
// import Button from "../../components/button/Button"
import { setAccessToken } from "../../accessToken"
import { useQuery } from "@apollo/react-hooks"
import { LOGOUT_MUTATION } from "../../graphQL/mutations"
import { useMutation } from "@apollo/react-hooks"
import { useHistory } from "react-router-dom"
import { GoogleLogout } from "react-google-login"
import { CURRENT_USER } from "../../graphQL/queries"
// --------------------------------------------------------------

function UserAccount() {
  // query ----------------
  const [logout, { client }] = useMutation(LOGOUT_MUTATION)
  const { data, loading } = useQuery(CURRENT_USER) //TODO: current user vom store holen statt immer wieder vom server abzurufen (bzw einmal vl in app.js vom server holen dann im store speicher)

  const history = useHistory()
  let logoutButton
  if (!loading && data && !data.currentUser.googleLogin)
    logoutButton = (
      <button
        className="stan-btn-primary"
        onClick={async () => logUserOut({ logout, client, history })}
      >
        Logout
      </button>
    )
  else
    logoutButton = (
      <GoogleLogout
        clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
        buttonText="Logout"
        onLogoutSuccess={async () => logUserOut({ logout, client, history })}
        render={renderProps => (
          <button
            onClick={renderProps.onClick}
            disabled={renderProps.disabled}
            className="stan-btn-primary"
          >
            Logout
          </button>
        )}
      ></GoogleLogout>
    )

  // return ----------------
  return (
    <div className="navigation__title">
      <h2>User Account </h2>
      {logoutButton}
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
