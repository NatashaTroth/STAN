import React from "react"
// --------------------------------------------------------------

// components
import SignUpForm from "../../components/signup/SignUp"

function SignUpPage() {
  return (
    <div className="signup">
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-12">
            <h2 className="signup__heading">Sign Up</h2>
            <p className="signup__sub-heading">
              You can sign up via Google or with your E-Mail address
            </p>
          </div>

          <div className="col-md-12">
            <SignUpForm />
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignUpPage
