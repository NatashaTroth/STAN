import React from "react"
import { LOGIN_MUTATION, GOOGLE_LOGIN_MUTATION } from "../../graphQL/mutations"
import { useForm } from "react-hook-form"
import { useMutation } from "@apollo/react-hooks"
import { useHistory } from "react-router-dom"
import { setAccessToken } from "../../accessToken"
// import ReactDOM from "react-dom"
import { GoogleLogin } from "react-google-login"
// --------------------------------------------------------------

// components ----------------
import Input from "../../components/input/Input"
import Label from "../../components/label/Label"
import Button from "../../components/button/Button"

function Login() {
  const history = useHistory()
  const successGoogle = async response => {
    try {
      const resp = await googleLogin({
        variables: {
          idToken: response.tokenId,
        },
      })
      //TODO: the errors returned from verifying the google token id in the backend can return some complicated errors - better give user more simple error messages
      if (resp && resp.data && resp.data.googleLogin)
        setAccessToken(resp.data.googleLogin.accessToken)
      else throw new Error("The google login failed")

      history.push("/")
      window.location.reload()
    } catch (err) {
      //TODO: USER DEN ERROR MITTEILEN
      console.error(err.message)
    }
  }
  const failureGoogle = response => {
    console.log(JSON.stringify(response.Qt.Ad))
  }

  // mutation ----------------
  const [googleLogin, { googleLoginData }] = useMutation(GOOGLE_LOGIN_MUTATION)
  const [login, { loginData }] = useMutation(LOGIN_MUTATION)

  // form specific ----------------
  const { register, errors, handleSubmit } = useForm()

  const onSubmit = async formData => {
    await handleLogin({ formData, login, history })
  }

  // return ----------------
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="login__form box-content">
      <div className="row">
        <div className="col-md-12 login__form__inner">
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
              <span className="error">Minimum 1 character required</span>
            )}
            {errors.email && errors.email.type === "maxLength" && (
              <span className="error">Maximum 50 characters allowed</span>
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
              placeholder=""
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
              <span className="error">Minimum 8 characters required</span>
            )}
            {errors.password && errors.password.type === "maxLength" && (
              <span className="error">Maximum 30 characters allowed</span>
            )}
            {errors.password && errors.password.type === "pattern" && (
              <span className="error">
                The password needs to be between 8 and 30 characters long
              </span>
            )}
          </div>

          <div className="login__form__buttons">
            <div className="login__form__buttons__button-right">
              <Button
                className="stan-btn-primary"
                variant="button"
                text="Login"
              />
            </div>
            <div className="login__form__buttons__button-left">
              <GoogleLogin
                clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
                buttonText="Login"
                render={renderProps => (
                  <button
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
          </div>
          <div className="login__form__redirect-signup">
            <p className="login__form__redirect-signup__text">
              not registered?
            </p>{" "}
            <a href="/sign-up" className="login__form__redirect-signup__link">
              sign up
            </a>
          </div>
        </div>
      </div>
    </form>
  )
}

export default Login

async function handleLogin({ formData, login, history }) {
  try {
    const resp = await login({
      variables: {
        email: formData.email,
        password: formData.password,
      },
      //TODO: STORE - ICH WEIß NICHT OB IHR DAS VERWENDET 😅lg natasha
      //https://www.apollographql.com/docs/react/caching/cache-interaction/
      // update: (store, { data }) => {
      //   if (!data) return null
      //   store.writeQuery({
      //     //update current user in cache
      //     query: LOGIN_MUTATION,
      //     data: data.login.user,
      //   })
      // },
    })

    if (resp && resp.data && resp.data.login) {
      setAccessToken(resp.data.login.accessToken)
    } else {
      // displays server error (backend)
      throw new Error("The login failed")
    }
    // redirect
    history.push("/")
    window.location.reload()
  } catch (err) {
    //TODO-AUTH: USER DEN ERROR MITTEILEN
    console.error(err.message)
    // console.log(err)
  }
}
