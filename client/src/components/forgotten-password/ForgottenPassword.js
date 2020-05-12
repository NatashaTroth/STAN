import React, { useState } from "react"
import { useForm } from "react-hook-form"
// --------------------------------------------------------------

// components
import Input from "../../components/input/Input"
import Label from "../../components/label/Label"
import Button from "../../components/button/Button"
import Login from "../../components/login/Login"

const ForgottenPassword = () => {
  // form specific ----------------
  const { register, errors, handleSubmit } = useForm()

  // state ----------------
  const [openLogin, setLogin] = useState(false)

  const handleLogin = () => {
    setLogin(openLogin => !openLogin)
  }

  if (openLogin) return <Login />

  return (
    <form className="login__form form-submit box-content">
      <div className="row">
        <div className="col-md-12 login__form__inner">
          <div className="login__form__element forgottenPassword__form__headline">
            <h3>Forgot your password?</h3>
          </div>
          <div className="login__form__element forgottenPassword__form__content">
            <p>
              Don't worry. Resetting your password is easy, just tell us the
              email address you registered with stan.
            </p>
          </div>

          <div className="login__form__element">
            <Label
              for="email"
              text="E-Mail"
              className="login__form__element__label input-required"
            ></Label>
            <Input
              className="login__form__element__input email-input"
              type="email"
              id="email"
              label="email"
              placeholder="lucy@stan.io"
              required
              ref={register({
                required: true,
                minLength: 1,
                maxLength: 50,
                pattern: /^([\w_\-\.\"\+\!\#\$\%\&\'\*\/\=\?\^\`\{\|\}\~ ]{1,64})@([\w_\-\.]+)\.([a-z]+)$/,
              })}
            />

            {errors.email && errors.email.type === "required" && (
              <span className="error">This field is required</span>
            )}
            {errors.email && errors.email.type === "minLength" && (
              <span className="error">Minimum 1 character required</span>
            )}
            {errors.email && errors.email.type === "maxLength" && (
              <span className="error">Maximum 50 characters allowed</span>
            )}
            {errors.email && errors.email.type === "pattern" && (
              <span className="error">This is no valid e-mail address</span>
            )}
          </div>

          <div className="login__form__buttons">
            <Button
              type="submit"
              className="stan-btn-primary"
              variant="button"
              text="Send reset password link"
            />
          </div>

          <div className="login__form__bottom">
            <div className="login__form__bottom--redirect-signup">
              <p className="login__form__bottom--redirect-signup__text">
                remember your password?
              </p>{" "}
              <button type="button" variant="button" onClick={handleLogin}>
                login
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}

export default ForgottenPassword
