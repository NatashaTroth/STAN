import React, { useState } from "react"
// --------------------------------------------------------------

// components
import Input from "../../components/input/Input"
import Label from "../../components/label/Label"
import Button from "../../components/button/Button"

function SignUp() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [username, setUsername] = useState("")

  const handleSubmit = evt => {
    evt.preventDefault()
  }

  return (
    <form onSubmit={handleSubmit} className="signup__form">
      <Label
        for="username"
        text="Username"
        className="signup__form__username-label input-required"
      ></Label>
      <Input
        type="text"
        id="username"
        name="username"
        placeholder="lucy@stan.io"
        value={username}
        maxLength={50}
        className="signup__form__username-input"
        onChange={evt => setUsername(evt.target.value.slice(0, 50))}
        required
      />
      <Label
        for="email"
        text="E-Mail"
        className="signup__form__email-label input-required"
      ></Label>
      <Input
        type="email"
        id="email"
        name="email"
        placeholder="lucy@stan.io"
        value={email}
        maxLength={50}
        className="signup__form__email-input"
        onChange={evt => setEmail(evt.target.value.slice(0, 50))}
        required
      />
      <Label
        for="password"
        text="Pasword"
        className="signup__form__password-label input-required"
      ></Label>
      <Input
        type="password"
        id="password"
        name="password"
        placeholder=""
        value={password}
        maxLength={30}
        className="signup__form__passwort-input"
        onChange={evt => setPassword(evt.target.value.slice(0, 30))}
        required
      />
      <div className="signup__form__buttons">
        <div className="col-md-6 signup__button-left">
          <Button variant="button" text="Google Login" />
        </div>

        <div className="col-md-6 signup__button-right">
          <Button variant="button" text="Login" />
        </div>
      </div>
      <div className="col-md-12 signup__form__redirect-signup">
        <p className="signup__form__redirect-signup__text">
          already have an account?
        </p>{" "}
        <a href="/login" className="signup__form__redirect-signup__link">
          {" "}
          login
        </a>
      </div>
    </form>
  )
}

export default SignUp
