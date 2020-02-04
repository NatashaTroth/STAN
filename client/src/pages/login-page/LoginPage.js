import React from "react"
// --------------------------------------------------------------

// components
import LoginForm from "../../components/login/Login"

function LoginPage() {
  return (
    <div className="login">
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-12">
            <h2 className="login__heading">Login</h2>
            <p className="login__sub-heading">
              You can log into your account via Google or your E-Mail address
            </p>
          </div>
          <div className="col-md-12">
            <LoginForm />
          </div>

          <div className="col-md-12 login__redirect-signup">
            <p>not registered?</p> <a href="/signup"> sign up</a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
