import React from "react"
import { useForm } from "react-hook-form"
// --------------------------------------------------------------

// components ----------------
import Button from "../../components/button/Button"
import Label from "../../components/label/Label"

// sub-components ----------------
import Image from "../../components/image/Image"

// mascots ----------------
import VeryHappyMascot from "../../images/mascots/user-mascot/0-0.svg"
import VeryHappyGirlyMascot from "../../images/mascots/user-mascot/1-0.svg"
import VeryHappyCleverMascot from "../../images/mascots/user-mascot/2-0.svg"

// libraries
import { Carousel } from "react-responsive-carousel"
import "react-responsive-carousel/lib/styles/carousel.min.css"

const UserAccountEdit = () => {
  //   const { register, errors, handleSubmit } = useForm()

  //   const currentUser = useCurrentUserValue()

  // functions ----------------
  const handleMascotCallback = id => {
    // mascotStore.mascot = id
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
              <div className="user-account__edit--heading--delete-btn">
                <a href="#">Delete</a>
              </div>
            </div>
          </div>
          <div className="col-xl-6">
            <form
              //   onSubmit={handleSubmit(onSubmit)}
              className="user-account__edit--form"
            >
              <div className="add-new__form__element">
                <Label
                  htmlFor="name"
                  text="Name"
                  className="add-new__form__element__label input-required"
                />

                <input
                  type="text"
                  id="name"
                  label="name"
                  required
                  //   ref={register({
                  //     required: true,
                  //     minLength: 1,
                  //     maxLength: 20,
                  //   })}
                />
              </div>

              <div className="add-new__form__element">
                <Label
                  htmlFor="email"
                  text="Email"
                  className="add-new__form__element__label input-required"
                />

                <input
                  type="email"
                  id="email"
                  label="email"
                  required
                  //   ref={register({
                  //     required: true,
                  //     minLength: 1,
                  //     maxLength: 20,
                  //   })}
                />
              </div>

              <div className="add-new__form__element">
                <Label
                  htmlFor="password"
                  text="Password"
                  className="add-new__form__element__label input-required"
                />

                <input
                  type="password"
                  id="password"
                  label="password"
                  required
                  //   ref={register({
                  //     required: true,
                  //     minLength: 1,
                  //     maxLength: 20,
                  //   })}
                />
              </div>

              <div className="add-new__form__element">
                <Label
                  htmlFor="current-password"
                  text="Current password"
                  className="add-new__form__element__label input-required"
                />

                <input
                  type="password"
                  id="current-password"
                  label="current-password"
                  required
                  //   ref={register({
                  //     required: true,
                  //     minLength: 1,
                  //     maxLength: 20,
                  //   })}
                />
              </div>

              <div className="add-new__form__element">
                <Label
                  htmlFor="new-password"
                  text="New password"
                  className="add-new__form__element__label input-required"
                />

                <input
                  type="password"
                  id="new-password"
                  label="new-password"
                  required
                  //   ref={register({
                  //     required: true,
                  //     minLength: 1,
                  //     maxLength: 20,
                  //   })}
                />
              </div>

              <div className="add-new__form__element">
                <Label
                  htmlFor="retype-password"
                  text="Retype new password"
                  className="add-new__form__element__label input-required"
                />

                <input
                  type="password"
                  id="retype-password"
                  label="retype-password"
                  required
                  //   ref={register({
                  //     required: true,
                  //     minLength: 1,
                  //     maxLength: 20,
                  //   })}
                />
              </div>
            </form>
          </div>

          <div className="col-xl-6">
            <div className="user-account__edit__carousel">
              <h4>Choose your mascot</h4>

              <Carousel
                showStatus={false}
                showThumbs={false}
                useKeyboardArrows={true}
                onChange={handleMascotCallback}
              >
                <Image path={VeryHappyMascot} text="a very happy mascot" />
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
    </div>
  )
}

export default UserAccountEdit
