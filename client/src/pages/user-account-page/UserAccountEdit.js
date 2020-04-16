import React, { useState, useEffect } from "react"
import { useHistory } from "react-router-dom"
import { setAccessToken } from "../../accessToken"
import { useForm } from "react-hook-form"
// --------------------------------------------------------------

// context ----------------
import { useCurrentUserValue } from "../../components/STAN/STAN"

// mutations ----------------
import { DELETE_USER_MUTATION } from "../../graphQL/mutations"
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
import { Carousel } from "react-responsive-carousel"
import "react-responsive-carousel/lib/styles/carousel.min.css"

// TODO: add updateUser mutation
const UserAccountEdit = () => {
  // variables ----------------
  let defaultValues
  let mascotStore = {}

  // mutations ----------------
  const [deleteUser] = useMutation(DELETE_USER_MUTATION)
  // const [updateUser = useMutation()

  // state ----------------
  const [deleteProfile, setDeletion] = useState(false)

  // context ----------------
  const currentUser = useCurrentUserValue()

  // set default variables in form and make it editable ----------------
  const { register, errors, watch, setValue, handleSubmit } = useForm({
    defaultValues: {
      username: currentUser.username,
      email: currentUser.email,
    },
  })

  const { username, email } = watch()
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
    // handleExam({ mascotStore, formData, updateUser })
  }

  const handleMascotCallback = id => {
    mascotStore = {
      mascotId: id,
    }
  }

  const handleUser = () => {
    setDeletion(deleteProfile => !deleteProfile)
  }

  const handleDeletion = () => {
    examDeletion({ currentUser, deleteUser })
  }

  return (
    <div className="user-account__edit box-content">
      <div className="container-fluid">
        <div className="row">
          <div className="col-xl-12">
            <div className="user-account__edit--heading">
              <div className="user-account__edit--heading--sub-heading">
                <h3>edit your profile details</h3>
              </div>
              {!currentUser.googleLogin ? (
                <div className="user-account__edit--heading--delete-btn">
                  <Button onClick={handleUser} text="Delete" />
                </div>
              ) : null}
            </div>
          </div>
          <div className="col-xl-12">
            <form onSubmit={handleSubmit(onSubmit)} className="form">
              <div className="container-fluid">
                <div className="row">
                  <div className="col-xl-6">
                    <div className="form__element">
                      <Label
                        htmlFor="username"
                        text="Name"
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
                        <span className="error">This field is required</span>
                      ) : null}
                      {errors.username &&
                      errors.username.type === "minLength" ? (
                        <span className="error">
                          {" "}
                          Minimum 8 character required
                        </span>
                      ) : null}
                      {errors.username &&
                      errors.username.type === "maxLength" ? (
                        <span className="error">
                          {" "}
                          Maximum 30 characters allowed
                        </span>
                      ) : null}
                      {errors.username && errors.username.type === "pattern" ? (
                        <span className="error">
                          The username needs to be between 1 and 30 characters
                          long
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

                      {errors.email && errors.email.type === "required" && (
                        <span className="error">This field is required</span>
                      )}
                      {errors.email && errors.email.type === "minLength" && (
                        <span className="error">
                          Minimum 1 character required
                        </span>
                      )}
                      {errors.email && errors.email.type === "maxLength" && (
                        <span className="error">
                          Maximum 50 characters allowed
                        </span>
                      )}
                      {errors.email && errors.email.type === "pattern" && (
                        <span className="error">
                          This is no valid e-mail address
                        </span>
                      )}
                    </div>

                    {!currentUser.googleLogin ? (
                      <div className="form__element">
                        <Label
                          htmlFor="password"
                          text="Password"
                          className="form__element__label"
                        />

                        <input
                          type="password"
                          id="password"
                          label="password"
                          name="password"
                          // required
                          ref={register({
                            // required: true,
                            minLength: 8,
                            maxLength: 30,
                            pattern: /^.{8,30}$/,
                          })}
                        />

                        {/* {errors.password &&
                        errors.password.type === "required" ? (
                          <span className="error">This field is required</span>
                        ) : null} */}
                        {errors.password &&
                        errors.password.type === "minLength" ? (
                          <span className="error">
                            {" "}
                            Minimum 8 characters required
                          </span>
                        ) : null}
                        {errors.password &&
                        errors.password.type === "maxLength" ? (
                          <span className="error">
                            {" "}
                            Maximum 30 characters allowed
                          </span>
                        ) : null}
                        {errors.password &&
                        errors.password.type === "pattern" ? (
                          <span className="error">
                            The password needs to be between 8 and 30 characters
                            long
                          </span>
                        ) : null}
                      </div>
                    ) : null}

                    {!currentUser.googleLogin ? (
                      <div className="form__element">
                        <Label
                          htmlFor="currentPassword"
                          text="Current password"
                          className="form__element__label"
                        />

                        <input
                          type="password"
                          id="currentPassword"
                          label="currentPassword"
                          name="currentPassword"
                          // required
                          ref={register({
                            // required: true,
                            minLength: 8,
                            maxLength: 30,
                            pattern: /^.{8,30}$/,
                          })}
                        />

                        {/* {errors.password &&
                        errors.password.type === "required" ? (
                          <span className="error">This field is required</span>
                        ) : null} */}
                        {errors.password &&
                        errors.password.type === "minLength" ? (
                          <span className="error">
                            {" "}
                            Minimum 8 characters required
                          </span>
                        ) : null}
                        {errors.password &&
                        errors.password.type === "maxLength" ? (
                          <span className="error">
                            {" "}
                            Maximum 30 characters allowed
                          </span>
                        ) : null}
                        {errors.password &&
                        errors.password.type === "pattern" ? (
                          <span className="error">
                            The password needs to be between 8 and 30 characters
                            long
                          </span>
                        ) : null}
                      </div>
                    ) : null}

                    {!currentUser.googleLogin ? (
                      <div className="form__element">
                        <Label
                          htmlFor="newPassword"
                          text="New password"
                          className="form__element__label"
                        />

                        <input
                          type="password"
                          id="newPassword"
                          label="newPassword"
                          name="newPassword"
                          // required
                          ref={register({
                            // required: true,
                            minLength: 8,
                            maxLength: 30,
                            pattern: /^.{8,30}$/,
                          })}
                        />

                        {/* {errors.password &&
                        errors.password.type === "required" ? (
                          <span className="error">This field is required</span>
                        ) : null} */}
                        {errors.password &&
                        errors.password.type === "minLength" ? (
                          <span className="error">
                            {" "}
                            Minimum 8 characters required
                          </span>
                        ) : null}
                        {errors.password &&
                        errors.password.type === "maxLength" ? (
                          <span className="error">
                            {" "}
                            Maximum 30 characters allowed
                          </span>
                        ) : null}
                        {errors.password &&
                        errors.password.type === "pattern" ? (
                          <span className="error">
                            The password needs to be between 8 and 30 characters
                            long
                          </span>
                        ) : null}
                      </div>
                    ) : null}

                    {!currentUser.googleLogin ? (
                      <div className="form__element">
                        <Label
                          htmlFor="retypePassword"
                          text="Retype new password"
                          className="form__element__label"
                        />

                        <input
                          type="password"
                          id="retypePassword"
                          label="retypePassword"
                          name="retypePassword"
                          // required
                          ref={register({
                            // required: true,
                            minLength: 8,
                            maxLength: 30,
                            pattern: /^.{8,30}$/,
                          })}
                        />

                        {/* {errors.password &&
                        errors.password.type === "required" ? (
                          <span className="error">This field is required</span>
                        ) : null} */}
                        {errors.password &&
                        errors.password.type === "minLength" ? (
                          <span className="error">
                            {" "}
                            Minimum 8 characters required
                          </span>
                        ) : null}
                        {errors.password &&
                        errors.password.type === "maxLength" ? (
                          <span className="error">
                            {" "}
                            Maximum 30 characters allowed
                          </span>
                        ) : null}
                        {errors.password &&
                        errors.password.type === "pattern" ? (
                          <span className="error">
                            The password needs to be between 8 and 30 characters
                            long
                          </span>
                        ) : null}
                      </div>
                    ) : null}
                  </div>

                  <div className="col-xl-6">
                    <div className="user-account__edit__carousel">
                      <h4>Choose your mascot</h4>

                      <Carousel
                        showStatus={false}
                        showThumbs={false}
                        useKeyboardArrows={true}
                        onChange={handleMascotCallback}
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
                      </Carousel>

                      <div className="user-account__edit--form__button">
                        <Button
                          variant="button"
                          text="Save"
                          className="stan-btn-primary"
                        />
                      </div>
                    </div>
                  </div>
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

                  <div className="col-md-12" id="success-container-delete-user">
                    <p className="success">
                      your account was successfully deleted
                    </p>
                  </div>

                  <div className="col-md-12" id="error-container-delete-user">
                    <p className="error">
                      Oops! an error occurred whilst deleting stan's memory
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          <div className="col-md-12" id="success-container-edit-user">
            <p className="success">the changes were successfully saved</p>
          </div>

          <div className="col-md-12" id="error-container-edit-user">
            <p className="error">
              Oops! an error occurred whilst updating stan's memory
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserAccountEdit

async function examDeletion({ currentUser, deleteUser }) {
  try {
    const resp = await deleteUser({
      currentUser,
    })

    if (resp && resp.data && resp.data.deleteUser) {
      setAccessToken("")
      document.getElementById("success-container-delete-user").style.display =
        "block"
    } else {
      document.getElementById("error-container-delete-user").style.display =
        "block"
    }

    // reset mascot event ----------------
    window.localStorage.setItem("mascot-event", false)

    // redirect
    setTimeout(() => {
      window.location.href = "/sign-up"
    }, 2000)
  } catch (err) {
    //TODO: USER DEN ERROR MITTEILEN
    console.error(err.message)
    // console.log(err)
  }
}

async function editUser({ mascotStore, formData, updateUser }) {
  try {
    const resp = await updateUser({
      // variables: {
      // }
    })

    if (resp && resp.data && resp.data.updateUser) {
      document.getElementById("success-container-edit-user").style.display =
        "block"
    } else {
      document.getElementById("error-container-edit-user").style.display =
        "block"
    }

    // redirect
    setTimeout(() => {
      window.location.reload()
    }, 2000)
  } catch (err) {
    //TODO: USER DEN ERROR MITTEILEN
    console.error(err.message)
  }
}
