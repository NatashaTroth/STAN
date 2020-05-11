import React from "react"
import { Redirect } from "react-router-dom"
// --------------------------------------------------------------

// queries ----------------
import { CURRENT_USER } from "../../graphQL/queries"

// apolloClient cache ----------------
import { client } from "../../apolloClient"

const LoginPopUp = () => {
  // redirects ----------------
  const currentUser = client.readQuery({ query: CURRENT_USER }).currentUser
  if (
    currentUser !== null ||
    window.localStorage.getItem("popup-event") === "false"
  ) {
    return <Redirect to="/" />
  }
  // return ----------------
  return (
    <div className="popup">
      <div className="popup__inner box-content">
        <div className="popup__inner--headline">
          <h4>Not Logged In</h4>
        </div>
        <div className="popup__inner--content">
          <div className="text">
            <p>Please log in to continue.</p>
          </div>
          <div className="login-btn">
            <a href="/login" className="stan-btn-secondary">
              Login
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPopUp
