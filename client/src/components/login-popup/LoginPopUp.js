import React from "react"
// --------------------------------------------------------------

function LoginPopUp() {
  // return ----------------
  return (
    <div className="popup">
      <div className="popup__container">
        <div className="popup__headline">
          <h4>Not Logged In</h4>
        </div>

        <div className="popup__content">
          <p className="popup__content__paragraph">
            Please log in to continue.
          </p>
          <a href="/login" className="popup__content__btn stan-btn-secondary">
            Login
          </a>
        </div>
      </div>
    </div>
  )
}

export default LoginPopUp
