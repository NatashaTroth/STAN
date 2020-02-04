import React, { useState } from "react"
// --------------------------------------------------------------

// components
import Input from "../../components/input/Input"
import Label from "../../components/label/Label"
import Button from "../../components/button/Button"

function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = evt => {
    evt.preventDefault()
  }

  return (
    <div className="login">
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-12">
            <h2 className="login-page__heading">Login</h2>
            <p className="login-page__sub-heading">
              You can log into your account via Google or your E-Mail address
            </p>
          </div>
          <div className="row">
            <div className="col-md-12">
              <form onSubmit={handleSubmit} className="login__form">
                <Label for="email" text="E-Mail"></Label>
                <Input
                  type="email"
                  name="email"
                  placeholder="lucy@stan.io"
                  value={email}
                  maxLength={50}
                  onChange={evt => setEmail(evt.target.value.slice(0, 50))}
                />

                <Label for="password" text="Pasword"></Label>
                <Input
                  type="password"
                  name="password"
                  placeholder=""
                  value={password}
                  maxLength={30}
                  onChange={evt => setPassword(evt.target.value.slice(0, 30))}
                />

                <div className="col-md-6 login__button-left">
                  <Button variant="button" text="Google Login" />
                </div>

                <div className="col-md-6 login__button-right">
                  <Button variant="button" text="Login" />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
