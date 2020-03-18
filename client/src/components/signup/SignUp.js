import React from "react"
import { useMutation, useQuery } from "@apollo/react-hooks"
// import { SUCCESS_SIGNUP } from "../../graphQL/queries"
import {
  SIGNUP_MUTATION,
  GOOGLE_SIGNUP_MUTATION,
} from "../../graphQL/mutations"
import { useHistory } from "react-router-dom"
import { setAccessToken } from "../../accessToken"
import { useForm } from "react-hook-form"
import { GoogleLogin } from "react-google-login"

// --------------------------------------------------------------

// components ----------------
import Input from "../../components/input/Input"
import Label from "../../components/label/Label"
import Button from "../../components/button/Button"
// import { GOOGLE_AUTH_URL } from "../../graphQL/queries"
//TODO: block signup & login path when user is logged in

function SignUp() {
  const successGoogle = async response => {
    console.log(response.tokenId)
    try {
      const resp = await googleSignup({
        variables: {
          idToken: response.tokenId,
        },
      })
      //TODO: the errors returned from verifying the google token id in the backend can return some complicated errors - better give user more simple error messages
      // handleSignupResponse({ resp, history })
      if (resp && resp.data) {
        console.log(JSON.stringify(resp.data))
        setAccessToken(resp.data.googleSignup.accessToken)
        console.log("saved access token after signup")
      } else {
        // displays server error (backend)
        throw new Error("The sign up failed")
      }
      // redirect

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
  const [signup, { mutationData }] = useMutation(SIGNUP_MUTATION)
  // const { data, loading } = useQuery(GOOGLE_AUTH_URL)
  const [googleSignup, { mutationDataGoogleSignup }] = useMutation(
    GOOGLE_SIGNUP_MUTATION
  )

  const history = useHistory()

  // form specific ----------------
  const { register, errors, handleSubmit } = useForm()

  const onSubmit = async formData => {
    handleSignup({ formData, signup, history })
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
          </div>

          <div className="login__form__element">
            <Label
              for="password"
              text="Pasword"
              className="login__form__element__label input-required"
            ></Label>
            <Input
              className="login__form__element__input"
              type="password"
              id="password"
              label="password"
              placeholder="********"
              required
              ref={register({
                required: true,
                minLength: 8,
                maxLength: 30,
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
          </div>

          <div className="login__form__buttons">
            <div className="login__form__buttons__button-right">
              <Button
                variant="button"
                text="Sign up"
                className="stan-btn-primary"
              />
            </div>
            <div className="login__form__buttons__button-left">
              {/* <Button
                variant="button"
                text="Google Login"
                className="stan-btn-secondary"
              /> */}
              <GoogleLogin
                clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
                buttonText="Login"
                render={renderProps => (
                  <button
                    onClick={renderProps.onClick}
                    disabled={renderProps.disabled}
                    className="stan-btn-secondary"
                  >
                    Google Sign up
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

async function handleSignup({ formData, signup, history }) {
  // console.log("googlelogin: " + formData.googleLogin)
  try {
    const resp = await signup({
      variables: {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        // googleLogin: formData.googleLogin || false,
        mascot: 0, //TODO: make dynamic (user can choose mascot)
      },
    })
    // handleSignupResponse({ resp, history })
    if (resp && resp.data) {
      setAccessToken(resp.data.signup.accessToken)
      console.log("saved access token after signup")
    } else {
      // displays server error (backend)
      throw new Error("The sign up failed")
    }
    // redirect

    history.push("/")
    window.location.reload()
  } catch (err) {
    //TODO: USER DEN ERROR MITTEILEN
    console.error(err.message)
    // console.log(err)
  }
}

// function handleSignupResponse({ resp, history }) {
//   if (resp && resp.data) {
//     setAccessToken(resp.data.signup.accessToken)
//     console.log("saved access token after signup")
//   } else {
//     // displays server error (backend)
//     throw new Error("The sign up failed")
//   }
//   // redirect

//   history.push("/")
//   window.location.reload()
// }
