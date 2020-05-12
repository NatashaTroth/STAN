import React, { useState } from "react"
import { useForm } from "react-hook-form"
// --------------------------------------------------------------

// mutations ----------------
import { useQuery } from "@apollo/react-hooks"
import { FORGOTTEN_PASSWORD_EMAIL } from "../../graphQL/queries"

// components ----------------
import Login from "../../components/login/Login"
import QueryError from "../error/Error"
import Loading from "../loading/Loading"

// sub-components ----------------
import Input from "../../components/input/Input"
import Label from "../../components/label/Label"
import Button from "../../components/button/Button"

const ForgottenPassword = () => {
  // form specific ----------------
  const { register, errors, handleSubmit } = useForm()

  // mutations ----------------
  //   const { data, loading, error } = useQuery(FORGOTTEN_PASSWORD_EMAIL)

  // state ----------------
  const [openLogin, setLogin] = useState(false)

  // loading & error handling ----------------
  //   if (loading) return <Loading />
  //   if (error) return <QueryError errorMessage={error.message} />
  //   if (data && data.forgottenPasswordEmail) {
  //     console.log(data)
  //   }

  // functions ----------------
  const handleLogin = () => {
    setLogin(openLogin => !openLogin)
  }

  const onSubmit = async formData => {
    await handleForgottenPassword({ formData })
  }

  if (openLogin) return <Login />

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="login__form form-submit box-content"
    >
      <div className="row">
        <div id="success-container-forgotten-password">
          <p className="success">the reset password link is in your inbox</p>
        </div>
        <div className="error-handling-form">
          <p className="error graphql-forgotten-password-error"></p>
        </div>
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

          <div className="login__form__buttons forgottenPassword__form__button login__form__buttons__button-left">
            <Button
              type="submit"
              className="stan-btn-primary"
              variant="button"
              text="Send reset password link"
            />
          </div>

          <div className="login__form__bottom forgottenPassword__form__bottom">
            <div className="login__form__bottom--redirect-signup forgottenPassword__form__bottom__inner">
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

async function handleForgottenPassword({ formData, forgottenPasswordEmail }) {
  try {
    const resp = await forgottenPasswordEmail({
      variables: {
        email: formData.email,
      },
    })

    if (resp && resp.data && resp.data.forgottenPasswordEmail) {
      document.getElementById(
        "success-container-forgotten-password"
      ).style.display = "block"
    } else {
      throw new Error("Set forgotten password failed")
    }
  } catch (err) {
    // error handling ----------------
    let element = document.getElementsByClassName(
      "graphql-forgotten-password-error"
    )

    if (err.graphQLErrors && err.graphQLErrors[0]) {
      element[0].innerHTML = err.graphQLErrors[0].message
    } else {
      element[0].innerHTML = err.message
    }
  }
}
