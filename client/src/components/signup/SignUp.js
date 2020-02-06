import React, { useState } from "react"
import { useMutation } from "@apollo/react-hooks"
import { SUCCESS_SIGNUP } from "../../graphQL/queries"
import { SIGNUP_MUTATION } from "../../graphQL/mutations"
import { useHistory } from "react-router-dom"

// --------------------------------------------------------------

// components
import Input from "../../components/input/Input"
import Label from "../../components/label/Label"
import Button from "../../components/button/Button"

//TODO: block signup & login path when user is logged in

function SignUp() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [username, setUsername] = useState("")
  const history = useHistory()

  const handleSubmit = evt => {
    evt.preventDefault()
  }

  const [signup, { mutationData }] = useMutation(SIGNUP_MUTATION)

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
              text="Sign up"
              className="stan-btn-primary"
              onClick={async e => {
                e.preventDefault()
                //TODO: mascot & tokenversion nicht hardcodieren
                try {
                  const resp = await signup({
                    variables: {
                      username: username,
                      email: email,
                      password: password,
                      mascot: 1,
                      tokenVersion: 0,
                    },
                  })
                  console.log(resp)
                  history.push("/")
                } catch (err) {
                  //z.B. email gibts schon
                  //TODO: USER DEN ERROR MITTEILEN
                  // console.log(err.message)
                  console.log(err)
                }
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
