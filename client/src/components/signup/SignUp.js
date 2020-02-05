import React, { useState } from "react"
import { useMutation } from "@apollo/react-hooks"
import { SUCCESS_SIGNUP } from "../../graphQL/queries"
import { ADD_USER_MUTATION } from "../../graphQL/mutations"
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

  const [addUser, { mutationData }] = useMutation(ADD_USER_MUTATION)

  return (
    <form onSubmit={handleSubmit} className="login__form box-content">
      <div className="col-md-12 login__form__inner">
        <Label
          for="username"
          text="Username"
          className="login__form__username-label input-required"
        ></Label>
        <Input
          type="text"
          id="username"
          name="username"
          placeholder="lucy@stan.io"
          value={username}
          maxLength={50}
          className="login__form__username-input"
          onChange={evt => setUsername(evt.target.value.slice(0, 50))}
          required
        />
        <Label
          for="email"
          text="E-Mail"
          className="login__form__email-label input-required"
        ></Label>
        <Input
          type="email"
          id="email"
          name="email"
          placeholder="lucy@stan.io"
          value={email}
          maxLength={50}
          className="login__form__email-input"
          onChange={evt => setEmail(evt.target.value.slice(0, 50))}
          required
        />
        <Label
          for="password"
          text="Pasword"
          className="login__form__password-label input-required"
        ></Label>
        <Input
          type="password"
          id="password"
          name="password"
          placeholder=""
          value={password}
          maxLength={30}
          className="login__form__passwort-input"
          onChange={evt => setPassword(evt.target.value.slice(0, 30))}
          required
        />
        <div className="login__form__buttons">
          <div className="login__form__buttons__button-left">
            <Button
              variant="button"
              text="Google Login"
              className="stan-btn-secondary"
            />
          </div>

          <div className="login__form__buttons__button-right">
            <Button
              variant="button"
              text="Login"
              className="stan-btn-primary"
              onClick={e => {
                e.preventDefault()
                addUser({
                  variables: {
                    username: username,
                    email: email,
                    password: password,
                  },
                  refetchQueries: [{ query: SUCCESS_SIGNUP }],
                })
              }}
            />
          </div>
        </div>
        <div className="login__form__redirect-signup">
          <p className="login__form__redirect-signup__text">
            already have an account?
          </p>
          <a href="/login" className="login__form__redirect-signup__link">
            login
          </a>
        </div>
      </div>
    </form>
  )
}

export default SignUp
