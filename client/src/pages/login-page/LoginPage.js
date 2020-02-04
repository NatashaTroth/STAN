import React from "react"
// --------------------------------------------------------------

// components
import LoginForm from "../../components/login/Login"

function LoginPage() {
  return (
    <div className="login">
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-12 login__headline">
            <h2 className="login__headline__heading">Login</h2>
            <p className="login__headline__sub-heading">
              You can log into your account via Google or your E-Mail address
            </p>
          </div>
          <div className="col-md-12 login__form-container">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
