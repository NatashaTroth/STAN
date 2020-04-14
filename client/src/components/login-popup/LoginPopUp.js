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
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-4"></div>
          <div className="col-md-4">
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
          <div className="col-md-4"></div>
        </div>
      </div>
    </div>
  )
}

export default LoginPopUp
