import React from "react"
import { setAccessToken } from "../../accessToken"
import { useHistory } from "react-router-dom"
import { useForm } from "react-hook-form"
// --------------------------------------------------------------

// mutation & queries ----------------
import { useMutation } from "@apollo/react-hooks"
import { SIGNUP_MUTATION, GOOGLE_LOGIN_MUTATION } from "../../graphQL/mutations"
// import { SUCCESS_SIGNUP } from "../../graphQL/queries"

// google login ----------------
import { GoogleLogin } from "react-google-login"

// components ----------------
import Input from "../../components/input/Input"
import Label from "../../components/label/Label"
import Button from "../../components/button/Button"

function SignUp() {
  const history = useHistory()
  const { register, errors, handleSubmit } = useForm()

  // mutation ----------------
  const [signup] = useMutation(SIGNUP_MUTATION)
  const [googleLogin] = useMutation(GOOGLE_LOGIN_MUTATION)

  // google signup ----------------
  const successGoogle = async response => {
    try {
      const resp = await googleLogin({
        variables: {
          idToken: response.tokenId,
        },
      })
      //TODO: the errors returned from verifying the google token id in the backend can return some complicated errors - better give user more simple error messages
      if (resp && resp.data && resp.data.googleLogin)
        setAccessToken(resp.data.googleLogin)
      else throw new Error("The google login failed")

      history.push("/")
      window.location.reload()
    } catch (err) {
      //TODO: USER DEN ERROR MITTEILEN
      console.error(err.message)
    }
  }
  const failureGoogle = response => {
    // console.log(JSON.stringify(response.Qt.Ad))
    // TODO: USER MITTEILEN
    console.error("Google login failed")
  }

  // form specific ----------------
  const onSubmit = async formData => {
    handleSignup({ formData, signup })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="login__form box-content">
      <div className="row">
        <div className="col-md-12 login__form__inner">
          <div className="login__form__element">
            <Label
              for="username"
              text="Username"
              className="login__form__element__label input-required"
            ></Label>
            <Input
              className="login__form__element__input"
              type="text"
              id="username"
              label="username"
              placeholder="Lucy"
              required
              ref={register({
                required: true,
                minLength: 1,
                maxLength: 30,
                pattern: /^.{1,30}$/,
              })}
            />
            {errors.username && errors.username.type === "required" && (
              <span className="error">This field is required</span>
            )}
            {errors.username && errors.username.type === "minLength" && (
              <span className="error"> Minimum 8 character required</span>
            )}
            {errors.username && errors.username.type === "maxLength" && (
              <span className="error"> Maximum 30 characters allowed</span>
            )}
            {errors.username && errors.username.type === "pattern" && (
              <span className="error">
                The username needs to be between 1 and 30 characters long
              </span>
            )}
          </div>

          <div className="login__form__element">
            <Label
              for="email"
              text="E-Mail"
              className="login__form__element__label input-required"
            ></Label>
            <Input
              className="login__form__element__input"
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
              <span className="error"> Minimum 1 character required</span>
            )}
            {errors.email && errors.email.type === "maxLength" && (
              <span className="error"> Maximum 30 characters allowed</span>
            )}
            {errors.email && errors.email.type === "pattern" && (
              <span className="error">This is no valid e-mail address</span>
            )}
          </div>

          <div className="login__form__element">
            <Label
              for="password"
              text="Password"
              className="login__form__element__label input-required"
            ></Label>
            <Input
              className="login__form__element__input"
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
            {errors.password && errors.password.type === "required" && (
              <span className="error">This field is required</span>
            )}
            {errors.password && errors.password.type === "minLength" && (
              <span className="error"> Minimum 8 characters required</span>
            )}
            {errors.password && errors.password.type === "maxLength" && (
              <span className="error"> Maximum 30 characters allowed</span>
            )}
            {errors.password && errors.password.type === "pattern" && (
              <span className="error">
                The password needs to be between 8 and 30 characters long
              </span>
            )}
          </div>

          <div className="login__form__element">
            <Label
              for="retype_password"
              text="Retype password"
              className="login__form__element__label input-required"
            ></Label>
            <Input
              className="login__form__element__input"
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
            {errors.password && errors.password.type === "required" && (
              <span className="error">This field is required</span>
            )}
            {errors.password && errors.password.type === "minLength" && (
              <span className="error"> Minimum 8 characters required</span>
            )}
            {errors.password && errors.password.type === "maxLength" && (
              <span className="error"> Maximum 30 characters allowed</span>
            )}
            {errors.password && errors.password.type === "pattern" && (
              <span className="error">
                The password needs to be between 8 and 30 characters long
              </span>
            )}
          </div>

          <div className="login__form__buttons">
            <div className="login__form__buttons__button-right">
              <GoogleLogin
                clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
                buttonText="Login"
                render={renderProps => (
                  <button
                    type="button"
                    onClick={renderProps.onClick}
                    disabled={renderProps.disabled}
                    className="stan-btn-secondary"
                  >
                    Google Login
                  </button>
                )}
                onSuccess={successGoogle}
                onFailure={failureGoogle}
                cookiePolicy={"single_host_origin"}
              />
            </div>
            <div className="login__form__buttons__button-left">
              <Button
                type="submit"
                variant="button"
                text="Sign up"
                className="stan-btn-primary"
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
      </div>
    </form>
  )
}

export default SignUp

async function handleSignup({ formData, signup }) {
  try {
    const resp = await signup({
      variables: {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        mascot: 0,
      },
    })
    if (resp && resp.data && resp.data.signup) {
      setAccessToken(resp.data.signup)
      console.log("saved access token after signup")
    } else {
      // displays server error (backend)
      throw new Error("The sign up failed")
    }
    // redirect
    window.localStorage.setItem("mascot-event", true)
    window.location.reload()
  } catch (err) {
    //TODO: USER DEN ERROR MITTEILEN
    console.error(err.message)
    // console.log(err)
  }
}
