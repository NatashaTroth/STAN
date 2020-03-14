import React from "react"

function LoginPopUp() {
  return (
    <div className="popup">
      <div className="popup__container">
        <div className="popup__headline">
          <h4>Not Logged In</h4>
        </div>

        <div className="popup__content">
          <div className="popup__content--paragraph">
            <p>Please log in to continue. </p>
          </div>
          <a href="/login" className="stan-btn-secondary">
            Login
          </a>
        </div>
      </div>
    </div>
  )
}

export default LoginPopUp
