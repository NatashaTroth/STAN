import React from "react"
// --------------------------------------------------------------

// context
import { useCurrentUserValue } from "../../components/STAN/STAN"

// components ----------------
import LoginForm from "../../components/login/Login"
import { Redirect } from "react-router"

function LoginPage() {
  const currentUser = useCurrentUserValue()
  if (currentUser !== undefined) {
    return <Redirect to="/" />
  }

  // return ----------------
  return (
    <div className="login">
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-1"></div>
          <div className="col-md-10 login__headline">
            <h2 className="login__headline__heading">Login</h2>
            <p className="login__headline__sub-heading">
              You can log into your account via Google or your E-Mail address
            </p>
          </div>
          <div className="col-md-1"></div>
          <div className="col-md-2"></div>
          <div className="col-md-8 login__form-container">
            <LoginForm />
          </div>
          <div className="col-md-2"></div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
