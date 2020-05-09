import React from "react"
// --------------------------------------------------------------

// queries ----------------
import { CURRENT_USER } from "../../graphQL/queries"

// components ----------------
import LoginForm from "../../components/login/Login"
import { Redirect } from "react-router-dom"

// apolloClient cache ----------------
import { client } from "../../apolloClient"

const LoginPage = () => {
  // redirects ----------------
  const currentUser = client.readQuery({ query: CURRENT_USER }).currentUser
  if (currentUser !== null) {
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
