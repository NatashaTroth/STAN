import React, { useState } from "react"
import { LOGIN_MUTATION } from "../../graphQL/mutations"

// --------------------------------------------------------------

// components
import Input from "../../components/input/Input"
import Label from "../../components/label/Label"
import Button from "../../components/button/Button"
import { useMutation } from "@apollo/react-hooks"
import { setAccessToken } from "../../accessToken"

function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [login, { loginData }] = useMutation(LOGIN_MUTATION)

  // const handleSubmit = async evt => {
  //   evt.preventDefault()
  //   console.log("form submitted");

  //   const response = await login({
  //     variables: {
  //       email,
  //       password
  //     }
  //   });

  //   console.log(response)

  //   history.pushState("/");
  // }

  return (
    <form className="login__form box-content">
      <div className="col-md-12 login__form__inner">
        <Label
          for="email"
          text="E-Mail"
          className="login__form__email-label"
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
          className="login__form__password-label"
        ></Label>
        <Input
          type="password"
          id="password"
          name="password"
          placeholder=""
          value={password}
          maxLength={30}
          className="login__form__password-input"
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
              onClick={async e => {
                e.preventDefault()
                console.log("in onclick")
                const response = await login({
                  variables: {
                    email: email,
                    password: password,
                  },
                  refetchQueries: [{ query: LOGIN_MUTATION }],
                })

                console.log(response)

                if (response && response.data) {
                  setAccessToken(response.data.login.accessToken)
                }
              }}
            />
          </div>
        </div>
        <div className="login__form__redirect-signup">
          <p className="login__form__redirect-signup__text">not registered?</p>{" "}
          <a href="/sign-up" className="login__form__redirect-signup__link">
            sign up
          </a>
        </div>
      </div>
    </form>
  )
}

export default Login
