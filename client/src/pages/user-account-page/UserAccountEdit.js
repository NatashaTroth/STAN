import React, { useState, useEffect } from "react"
import { useHistory } from "react-router-dom"
import { setAccessToken } from "../../accessToken"
import { useForm } from "react-hook-form"
// --------------------------------------------------------------

// context ----------------
import {
  CurrentUserContext,
  useCurrentUserValue,
} from "../../components/STAN/STAN"

// mutations ----------------
import {
  DELETE_USER_MUTATION,
  UPDATE_MASCOT_MUTATION,
  UPDATE_USER_MUTATION,
} from "../../graphQL/mutations"
import { useMutation } from "@apollo/react-hooks"

// components ----------------
import Button from "../../components/button/Button"
import Label from "../../components/label/Label"

// sub-components ----------------
import Image from "../../components/image/Image"

// mascots ----------------
import VeryHappyMascot from "../../images/mascots/user-mascot/0-0.svg"
import VeryHappyGirlyMascot from "../../images/mascots/user-mascot/1-0.svg"
import VeryHappyCleverMascot from "../../images/mascots/user-mascot/2-0.svg"

// libraries ----------------
// import { Carousel } from "react-responsive-carousel"
import Carousel from "react-bootstrap/Carousel"
import "react-responsive-carousel/lib/styles/carousel.min.css"

const UserAccountEdit = () => {
  // variables ----------------
  const mascotStore = { mascot: 0 }
  let history = useHistory()

  // context ----------------
  const currentUser = useCurrentUserValue()

  // mutations ----------------
  const [deleteUser] = useMutation(DELETE_USER_MUTATION)
  const [updateUser] = useMutation(UPDATE_USER_MUTATION)
  const [updateMascot] = useMutation(UPDATE_MASCOT_MUTATION)

  // state ----------------
  const [deleteProfile, setDeletion] = useState(false)
  const [isPasswordOpen, setPasswordSection] = useState(false)
  const [index, setIndex] = useState(currentUser.mascot)
  let [notification, setNotification] = useState(
    currentUser.allowEmailNotifications
  )

  // set default variables in form and make it editable ----------------
  const { register, errors, watch, setValue, handleSubmit } = useForm({
    defaultValues: {
      username: currentUser.username,
      email: currentUser.email,
    },
  })

  const { username, email } = watch()

  // use effect ----------------
  useEffect(() => {
    register({ user: "username" })
    register({ user: "email" })
  }, [register])

  // functions ----------------
  const handleChange = (user, e) => {
    e.persist()
    setValue(user, e.target.value)
  }

  const onSubmit = formData => {
    // google login ----------------
    if (currentUser.googleLogin) {
      formData = mascotStore.mascot
      handleMascot({ formData, updateMascot })
    } else {
      // standard login ----------------
      if (formData.newPassword === formData.retypePassword) {
        document.getElementById("retype-password-error").style.display = "none"

        let mascotId = index
        editUser({ mascotId, formData, updateUser, history, notification })
      } else {
        document.getElementById("retype-password-error").style.display = "block"
      }
    }
  }

  // TODO: fix reset mascot after button click
  // functions ----------------
  const handleMascotCallback = id => {
    setIndex(id)
  }

  const handleUser = () => {
    setDeletion(deleteProfile => !deleteProfile)
  }

  const handleDeletion = () => {
    userDeletion({ currentUser, deleteUser })
  }

  const handleChangedPassword = () => {
    setPasswordSection(!isPasswordOpen)
  }

  const handleNotification = () => {
    setNotification(notification => !notification)
  }

  // return ----------------
  return (
    <div className="user-account-edit">
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-1"></div>
          <div className="col-md-10">
            <div className="user-account__headline">
              <CurrentUserContext.Consumer>
                {currentUser => {
                  let username = currentUser.username
                  if (username.slice(-1) === "s") {
                    return <h2>{username}' account</h2>
                  } else {
                    return <h2>{username}'s account</h2>
                  }
                }}
              </CurrentUserContext.Consumer>
            </div>
          </div>
          <div className="col-md-1"></div>

          <div className="col-md-1"></div>
          <div className="col-md-10">
            <div className="user-account__edit box-content">
              <div className="row">
                <div className="col-xl-12">
                  <div className="user-account__edit--heading">
                    <div className="user-account__edit--heading--sub-heading">
                      <h3>Edit your profile details</h3>
                    </div>

                    <div className="user-account__edit--heading--delete-btn">
                      <Button
                        className="back-button"
                        text="Back"
                        onClick={() => {
                          history.goBack()
                        }}
                      />
                      <Button
                        className="delete-button"
                        onClick={handleUser}
                        text="Delete"
                      />
                    </div>
                  </div>
                </div>
                <div className="col-xl-12">
                  <form onSubmit={handleSubmit(onSubmit)} className="form">
                    <div className="row">
                      {!currentUser.googleLogin ? (
                        <div className="col-xl-6 form__left">
                          <div className="form__element">
                            <div className="form__element--headline">
                              <h4>Profile details</h4>
                            </div>

                            <Label
                              htmlFor="username"
                              text="Username"
                              className="form__element__label input-required"
                            />

                            <input
                              type="text"
                              id="username"
                              label="username"
                              name="username"
                              value={username}
                              onChange={handleChange.bind(null, "username")}
                              required
                              ref={register({
                                required: true,
                                minLength: 1,
                                maxLength: 30,
                                pattern: /^.{1,30}$/,
                              })}
                            />

                            {errors.username &&
                            errors.username.type === "required" ? (
                              <span className="error">
                                This field is required
                              </span>
                            ) : null}
                            {errors.username &&
                            errors.username.type === "minLength" ? (
                              <span className="error">
                                {" "}
                                Minimum 1 character required
                              </span>
                            ) : null}
                            {errors.username &&
                            errors.username.type === "maxLength" ? (
                              <span className="error">
                                {" "}
                                Maximum 30 characters allowed
                              </span>
                            ) : null}
                            {errors.username &&
                            errors.username.type === "pattern" ? (
                              <span className="error">
                                The username needs to be between 1 and 30
                                characters long
                              </span>
                            ) : null}
                          </div>

                          <div className="form__element">
                            <Label
                              htmlFor="email"
                              text="Email"
                              className="form__element__label input-required"
                            />

                            <input
                              type="email"
                              id="email"
                              label="email"
                              name="email"
                              value={email}
                              onChange={handleChange.bind(null, "email")}
                              required
                              ref={register({
                                required: true,
                                minLength: 1,
                                maxLength: 50,
                                pattern: /^([\w_\-\.\"\+\!\#\$\%\&\'\*\/\=\?\^\`\{\|\}\~ ]{1,64})@([\w_\-\.]+)\.([a-z]+)$/,
                              })}
                            />

                            {errors.email &&
                            errors.email.type === "required" ? (
                              <span className="error">
                                This field is required
                              </span>
                            ) : null}
                            {errors.email &&
                            errors.email.type === "minLength" ? (
                              <span className="error">
                                Minimum 1 character required
                              </span>
                            ) : null}
                            {errors.email &&
                            errors.email.type === "maxLength" ? (
                              <span className="error">
                                Maximum 50 characters allowed
                              </span>
                            ) : null}
                            {errors.email && errors.email.type === "pattern" ? (
                              <span className="error">
                                This is no valid e-mail address
                              </span>
                            ) : null}
                          </div>

                          <div className="form__change-password">
                            <div className="form__passwordToggle">
                              <button
                                type="button"
                                variant="button"
                                onClick={handleChangedPassword}
                                className="form__passwordToggle--button"
                              >
                                <h4>Change password</h4>
                              </button>
                              <i
                                className={
                                  isPasswordOpen ? "arrow down" : "arrow right"
                                }
                              ></i>
                            </div>

                            {isPasswordOpen ? (
                              <div className="form__element">
                                <Label
                                  htmlFor="currentPassword"
                                  text="Current password"
                                  className="form__element__label input-required"
                                />

                                <input
                                  type="password"
                                  id="currentPassword"
                                  label="currentPassword"
                                  name="currentPassword"
                                  required
                                  ref={register({
                                    required: true,
                                    minLength: 8,
                                    maxLength: 30,
                                    pattern: /^.{8,30}$/,
                                  })}
                                />

                                {errors.currentPassword &&
                                errors.currentPassword.type === "minLength" ? (
                                  <span className="error">
                                    {" "}
                                    Minimum 8 characters required
                                  </span>
                                ) : null}
                                {errors.currentPassword &&
                                errors.currentPassword.type === "maxLength" ? (
                                  <span className="error">
                                    {" "}
                                    Maximum 30 characters allowed
                                  </span>
                                ) : null}
                                {errors.currentPassword &&
                                errors.currentPassword.type === "pattern" ? (
                                  <span className="error">
                                    The password needs to be between 8 and 30
                                    characters long
                                  </span>
                                ) : null}
                              </div>
                            ) : null}

                            {isPasswordOpen ? (
                              <div className="form__element">
                                <Label
                                  htmlFor="newPassword"
                                  text="New password"
                                  className="form__element__label input-required"
                                />

                                <input
                                  type="password"
                                  id="newPassword"
                                  label="newPassword"
                                  name="newPassword"
                                  required
                                  ref={register({
                                    required: true,
                                    minLength: 8,
                                    maxLength: 30,
                                    pattern: /^.{8,30}$/,
                                  })}
                                />

                                {errors.newPassword &&
                                errors.newPassword.type === "minLength" ? (
                                  <span className="error">
                                    {" "}
                                    Minimum 8 characters required
                                  </span>
                                ) : null}
                                {errors.newPassword &&
                                errors.newPassword.type === "maxLength" ? (
                                  <span className="error">
                                    {" "}
                                    Maximum 30 characters allowed
                                  </span>
                                ) : null}
                                {errors.newPassword &&
                                errors.newPassword.type === "pattern" ? (
                                  <span className="error">
                                    The password needs to be between 8 and 30
                                    characters long
                                  </span>
                                ) : null}
                              </div>
                            ) : null}

                            {isPasswordOpen ? (
                              <div className="form__element">
                                <Label
                                  htmlFor="retypePassword"
                                  text="Retype new password"
                                  className="form__element__label input-required"
                                />

                                <input
                                  type="password"
                                  id="retypePassword"
                                  label="retypePassword"
                                  name="retypePassword"
                                  required
                                  ref={register({
                                    required: true,
                                    minLength: 8,
                                    maxLength: 30,
                                    pattern: /^.{8,30}$/,
                                  })}
                                />

                                {errors.retypePassword &&
                                errors.retypePassword.type === "minLength" ? (
                                  <span className="error">
                                    {" "}
                                    Minimum 8 characters required
                                  </span>
                                ) : null}
                                {errors.retypePassword &&
                                errors.retypePassword.type === "maxLength" ? (
                                  <span className="error">
                                    {" "}
                                    Maximum 30 characters allowed
                                  </span>
                                ) : null}
                                {errors.retypePassword &&
                                errors.retypePassword.type === "pattern" ? (
                                  <span className="error">
                                    The password needs to be between 8 and 30
                                    characters long
                                  </span>
                                ) : null}
                              </div>
                            ) : null}
                          </div>

                          <div className="form__notifications login__form__notifications">
                            <label htmlFor="notification" className="container">
                              <input
                                type="checkbox"
                                id="notification"
                                name="notification"
                                value="notification"
                                defaultChecked={
                                  currentUser.allowEmailNotifications
                                }
                                onChange={handleNotification}
                              />
                              <span className="checkmark"></span>
                              Allow email notifications when exam date is close
                              (can be changed at any time in the user profile)
                            </label>
                          </div>
                        </div>
                      ) : null}

                      {!currentUser.googleLogin ? (
                        <div className="col-xl-6 form__right">
                          <div className="user-account__edit__carousel">
                            <h4>Choose your mascot</h4>

                            <Carousel
                              activeIndex={index}
                              onSelect={handleMascotCallback}
                              pause={false}
                              wrap={false}
                            >
                              <Carousel.Item>
                                <Image
                                  path={VeryHappyMascot}
                                  text="a very happy mascot"
                                />
                              </Carousel.Item>

                              <Carousel.Item>
                                <Image
                                  path={VeryHappyGirlyMascot}
                                  text="a very happy girly mascot"
                                />
                              </Carousel.Item>

                              <Carousel.Item>
                                <Image
                                  path={VeryHappyCleverMascot}
                                  text="a very happy clever mascot"
                                />
                              </Carousel.Item>
                            </Carousel>
                          </div>

                          <div className="user-account__edit--form__button">
                            <Button
                              variant="button"
                              text="Save"
                              className="stan-btn-primary"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="col-xl-12">
                          <div className="user-account__edit__carousel">
                            <h4>Choose your mascot</h4>

                            {/* <Carousel
                              showStatus={false}
                              showThumbs={false}
                              useKeyboardArrows={true}
                              onChange={e => {
                                handleMascotCallback(e)
                              }}
                              selectedItem={currentUser.mascot}
                            >
                              <Image
                                path={VeryHappyMascot}
                                text="a very happy mascot"
                              />
                              <Image
                                path={VeryHappyGirlyMascot}
                                text="a very happy girly mascot"
                              />
                              <Image
                                path={VeryHappyCleverMascot}
                                text="a very happy clever mascot"
                              />
                            </Carousel> */}
                          </div>

                          <div className="user-account__edit--form__button">
                            <Button
                              variant="button"
                              text="Save"
                              className="stan-btn-primary"
                            />
                          </div>
                        </div>
                      )}

                      <div
                        className="col-md-12"
                        id="success-container-edit-user"
                      >
                        <p className="success">
                          the changes were successfully saved
                        </p>
                      </div>

                      <div
                        className="col-md-12"
                        id="success-container-edit-mascot"
                      >
                        <p className="success">
                          the new mascot was successfully saved
                        </p>
                      </div>

                      <div className="col-md-12">
                        <div id="retype-password-error" className="error">
                          <p>Please make sure your new passwords match.</p>
                        </div>
                      </div>

                      <div className="col-md-12">
                        <p className="error graphql-user-edit-error"></p>
                        <p className="error graphql-user-mascot-edit-error"></p>
                      </div>
                    </div>
                  </form>
                </div>

                {deleteProfile ? (
                  <div className="col-xl-12">
                    <div className="user-account__edit--popup">
                      <div className="user-account__edit--popup--inner box-content">
                        <div className="user-account__edit--popup--inner--headline">
                          <h4>Are you sure you want to delete this account?</h4>
                        </div>

                        <div className="user-account__edit--popup--inner--buttons">
                          <Button
                            className="stan-btn-secondary"
                            text="Yes"
                            onClick={handleDeletion}
                          />
                          <Button
                            className="stan-btn-primary"
                            text="No"
                            onClick={handleUser}
                          />
                        </div>

                        <div className="col-md-12">
                          <p className="error graphql-user-delete-error"></p>
                        </div>

                        <div
                          className="col-md-12"
                          id="success-container-delete-user"
                        >
                          <p className="success">
                            your account was successfully deleted
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
          <div className="col-md-1"></div>
        </div>
      </div>
    </div>
  )
}

export default UserAccountEdit

async function userDeletion({ currentUser, deleteUser }) {
  try {
    const resp = await deleteUser({
      currentUser,
    })

    if (resp && resp.data && resp.data.deleteUser) {
      setAccessToken("")
      document.getElementById("success-container-delete-user").style.display =
        "block"
    } else {
      throw new Error("Cannot delete current user.")
    }

    // reset mascot event ----------------
    window.localStorage.setItem("mascot-event", false)

    // redirect ----------------
    setTimeout(() => {
      window.location.href = "/sign-up"
    }, 1000)
  } catch (err) {
    let element = document.getElementsByClassName("graphql-user-delete-error")

    if (err.graphQLErrors && err.graphQLErrors[0]) {
      element[0].innerHTML = err.graphQLErrors[0].message
    } else {
      element[0].innerHTML = err.message
    }
  }
}

async function editUser({
  mascotId,
  formData,
  updateUser,
  history,
  notification,
}) {
  try {
    const resp = await updateUser({
      variables: {
        username: formData.username,
        email: formData.email,
        password: formData.currentPassword,
        newPassword: formData.newPassword,
        mascot: mascotId,
        allowEmailNotifications: notification,
      },
    })

    if (resp && resp.data && resp.data.updateUser) {
      document.getElementById("success-container-edit-user").style.display =
        "block"
    } else {
      throw new Error("Cannot save user changes.")
    }

    // redirect ----------------
    setTimeout(() => {
      history.push("/profile")
    }, 1000)
  } catch (err) {
    let element = document.getElementsByClassName("graphql-user-edit-error")

    if (err.graphQLErrors && err.graphQLErrors[0]) {
      element[0].innerHTML = err.graphQLErrors[0].message
    } else {
      element[0].innerHTML = err.message
    }
  }
}

async function handleMascot({ formData, updateMascot }) {
  try {
    const resp = await updateMascot({
      variables: {
        mascot: formData,
      },
    })

    if (resp && resp.data && resp.data.updateMascot) {
      document.getElementById("success-container-edit-mascot").style.display =
        "block"
    } else {
      throw new Error("Cannot save the selected mascot.")
    }

    // redirect ----------------
    setTimeout(() => {
      window.location.href = "/profile"
    }, 1000)
  } catch (err) {
    let element = document.getElementsByClassName(
      "graphql-user-mascot-edit-error"
    )

    if (err.graphQLErrors && err.graphQLErrors[0]) {
      element[0].innerHTML = err.graphQLErrors[0].message
    } else {
      element[0].innerHTML = err.message
    }
  }
}
