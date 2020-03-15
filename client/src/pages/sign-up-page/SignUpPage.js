import React from "react"
// --------------------------------------------------------------

// components ----------------
import SignUpForm from "../../components/signup/SignUp"

function SignUpPage() {
  // return ----------------
  return (
    <div className="login">
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-1"></div>
          <div className="col-md-10 login__headline">
            <h2 className="login__headline__heading">Sign Up</h2>
            <p className="login__headline__sub-heading">
              You can sign up via Google or with your E-Mail address
            </p>
          </div>
          <div className="col-md-1"></div>
          <div className="col-md-2"></div>
          <div className="col-md-8 login__form-container">
            <SignUpForm />
          </div>
          <div className="col-md-2"></div>
        </div>
      </div>
    </div>
  )
}

export default SignUpPage
