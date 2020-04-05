import React from "react"

// --------------------------------------------------------------

// context ----------------
import { useCurrentUserValue } from "../STAN/STAN"
import { Redirect } from "react-router-dom"

function LoginPopUp() {
  // redirects ----------------
  const currentUser = useCurrentUserValue()
  if (
    currentUser !== undefined ||
    window.localStorage.getItem("popup-event") === "false"
  ) {
    return <Redirect to="/" />
  }
  // return ----------------
  return (
    <div className="popup">
      <div className="popup__container">
        <div className="popup__headline">
          <h4>Not Logged In</h4>
        </div>

        <div className="popup__content">
          <div className="popup__content__paragraph">
            <p>Please log in to continue.</p>
          </div>
          <div className="popup__content--btn">
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
