import React from "react"
import { Redirect } from "react-router-dom"
import { useForm } from "react-hook-form"
// --------------------------------------------------------------

// queries ----------------
import { CURRENT_USER } from "../../graphQL/queries"

// components ----------------
import Input from "../../components/input/Input"
import Label from "../../components/label/Label"
import Button from "../../components/button/Button"

// apolloClient cache ----------------
import { client } from "../../apolloClient"

const ResetPassword = () => {
  // form ----------------
  const { register, errors, handleSubmit } = useForm()

  // redirects ----------------
  const currentUser = client.readQuery({ query: CURRENT_USER }).currentUser
  if (currentUser !== null) {
    return <Redirect to="/" />
  }

  // form specific ----------------
  const onSubmit = async formData => {
    // if (formData.password === formData.retype_password) {
    //   document.getElementById("signup-error").style.display = "none"
    //   handleSignup({ formData, signup, notification })
    // } else {
    //   document.getElementById("signup-error").style.display = "block"
    // }
  }

  return (
    <div className="reset-password">
      <div className="container-fluid">
        <div clasName="row">
          <div className="col-md-1"></div>
          <div className="col-md-10 login__headline">
            <h2 className="login__headline__heading">Reset password</h2>
            <p className="login__headline__sub-heading">bla text bla</p>
          </div>
          <div className="col-md-1"></div>

          <div className="col-md-2"></div>
          <div className="col-md-8 login__form-container">
            <form onSubmit={handleSubmit(onSubmit)} className="box-content">
              <div className="login__form__element">
                <Label
                  for="password"
                  text="Password"
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
                  text="Retype password"
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
