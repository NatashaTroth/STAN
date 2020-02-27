import React from "react"
import { LOGIN_MUTATION } from "../../graphQL/mutations"
import { useForm } from "react-hook-form"
import { useMutation } from "@apollo/react-hooks"
import { useHistory } from "react-router-dom"
import { setAccessToken } from "../../accessToken"
// --------------------------------------------------------------

// components ----------------
import Input from "../../components/input/Input"
import Label from "../../components/label/Label"
import Button from "../../components/button/Button"

//TODO: block signup & login path when user is logged in

function Login() {
  // mutation ----------------
  const [login, { loginData }] = useMutation(LOGIN_MUTATION)
  const history = useHistory()

  // form specific ----------------
  const { register, errors, handleSubmit } = useForm()

  const onSubmit = async formData => {
    // TODO: überprüfen, wenn HTTP status im backend implementiert ist
    // formData.preventDefault();
    // fetch to authenticate user against the backend
    // fetch('../../../../server/auth.js', {
    //   method: 'POST',
    //   body: JSON.stringify(this.state),
    //   headers: {
    //     'Content-Type': 'application/json'
    //   }
    // })
    // .then(res => {
    //   if (res.status === 200) {
    //     this.props.history.push('/');
    //   } else {
    //     const error = new Error(res.error);
    //     throw error;
    //   }
    // })
    // .catch(err => {
    //   console.error(err);
    //   alert('Error logging in please try again');
    // });

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

      if (resp && resp.data) {
        setAccessToken(resp.data.login.accessToken)
      } else {
        // displays server error (backend)
        throw new Error("The login failed")
      }
      // redirect
      history.push("/")
    } catch (err) {
      //TODO: USER DEN ERROR MITTEILEN
      console.error(err.message)
      // console.log(err)
    }
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
              className="login__form__element__label"
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
              <span className="error"> Maximum 50 characters allowed</span>
            )}
          </div>

          <div className="login__form__element">
            <Label
              for="password"
              text="Pasword"
              className="login__form__element__label"
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
            <div className="login__form__buttons__button-left">
              <Button
                className="stan-btn-secondary"
                variant="button"
                text="Google Login"
              />
            </div>

            <div className="login__form__buttons__button-right">
              <Button
                className="stan-btn-primary"
                variant="button"
                text="Login"
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
