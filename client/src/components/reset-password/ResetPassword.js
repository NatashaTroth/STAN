import React from "react"
import { Redirect } from "react-router-dom"
import { useForm } from "react-hook-form"
// --------------------------------------------------------------

// queries ----------------
import { CURRENT_USER } from "../../graphQL/queries"

// mutations ----------------
import { useMutation } from "@apollo/react-hooks"
import { RESET_PASSWORD_MUTATION } from "../../graphQL/mutations"

// components ----------------
import Input from "../../components/input/Input"
import Label from "../../components/label/Label"
import Button from "../../components/button/Button"

// apolloClient cache ----------------
import { client } from "../../apolloClient"

const ResetPassword = () => {
  // form ----------------
  const { register, errors, handleSubmit } = useForm()

  // mutations ----------------
  const [resetPassword] = useMutation(RESET_PASSWORD_MUTATION)

  // redirects ----------------
  const currentUser = client.readQuery({ query: CURRENT_USER }).currentUser
  if (currentUser !== null) {
    return <Redirect to="/" />
  }

  // form specific ----------------
  const onSubmit = async formData => {
    if (formData.password === formData.retype_password) {
      document.getElementById("signup-error").style.display = "none"
      //   handleResetPassword({ formData, resetPassword })
    } else {
      document.getElementById("signup-error").style.display = "block"
    }
  }

  return (
    <div className="reset-password">
      <div className="container-fluid">
        <div clasName="row">
          <div className="col-md-1"></div>
          <div className="col-md-10 login__headline">
            <h2 className="login__headline__heading">Reset your password</h2>
            <p className="login__headline__sub-heading">bla text bla</p>
          </div>
          <div className="col-md-1"></div>

          <div className="col-md-2"></div>
          <div className="col-md-8 login__form-container">
            <form onSubmit={handleSubmit(onSubmit)} className="box-content">
              <div id="signup-error">
                <div className="error sign-up-error">
                  <p>Please make sure your passwords match.</p>
                </div>
              </div>

              <div className="error-handling-form">
                <p className="error graphql-sign-up-error"></p>
              </div>

              <div className="login__form__element">
                <Label
                  for="password"
                  text="New password"
                  className="login__form__element__label input-required"
                ></Label>
                <Input
                  className="login__form__element__input password-input"
                  type="password"
                  id="password"
                  label="password"
                  required
                  ref={register({
                    required: true,
                    minLength: 8,
                    maxLength: 30,
                    pattern: /^.{8,30}$/,
                  })}
                />
                {errors.password && errors.password.type === "required" ? (
                  <span className="error">This field is required</span>
                ) : null}
                {errors.password && errors.password.type === "minLength" ? (
                  <span className="error"> Minimum 8 characters required</span>
                ) : null}
                {errors.password && errors.password.type === "maxLength" ? (
                  <span className="error"> Maximum 30 characters allowed</span>
                ) : null}
                {errors.password && errors.password.type === "pattern" ? (
                  <span className="error">
                    The password needs to be between 8 and 30 characters long
                  </span>
                ) : null}
              </div>

              <div className="login__form__element">
                <Label
                  for="retype_password"
                  text="Confirm password"
                  className="login__form__element__label input-required"
                ></Label>
                <Input
                  className="login__form__element__input retype-password-input"
                  type="password"
                  id="retype_password"
                  label="retype_password"
                  required
                  ref={register({
                    required: true,
                    minLength: 8,
                    maxLength: 30,
                    pattern: /^.{8,30}$/,
                  })}
                />
                {errors.password && errors.password.type === "required" ? (
                  <span className="error">This field is required</span>
                ) : null}
                {errors.password && errors.password.type === "minLength" ? (
                  <span className="error"> Minimum 8 characters required</span>
                ) : null}
                {errors.password && errors.password.type === "maxLength" ? (
                  <span className="error"> Maximum 30 characters allowed</span>
                ) : null}
                {errors.password && errors.password.type === "pattern" ? (
                  <span className="error">
                    The password needs to be between 8 and 30 characters long
                  </span>
                ) : null}
              </div>

              <div className="login__form__buttons">
                <div className="login__form__buttons__button-left">
                  <Button
                    type="submit"
                    variant="button"
                    text="Send password"
                    className="stan-btn-primary submit-button"
                  />
                </div>
              </div>
            </form>
          </div>
          <div className="col-md-2"></div>
        </div>
      </div>
    </div>
  )
}

export default ResetPassword

async function handleResetPassword({ formData, resetPassword }) {
  try {
    const resp = await resetPassword({
      variables: {
        // userId: ,
        // token: ,
        // newPassword ,
      },
    })

    if (resp && resp.data && resp.data.resetPassword) {
    } else {
      throw new Error("Reset password failed")
    }

    // redirect ----------------
  } catch (err) {
    let element = document.getElementsByClassName("graphql-sign-up-error")

    if (err.graphQLErrors && err.graphQLErrors[0]) {
      element[0].innerHTML = err.graphQLErrors[0].message
    } else {
      element[0].innerHTML = err.message
    }
  }
}
