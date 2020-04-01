import React from "react"
import { useHistory } from "react-router-dom"
import { useForm } from "react-hook-form"
// --------------------------------------------------------------

// state
import { useCurrentUserValue } from "../../components/STAN/STAN"

// mutation & queries
import { useMutation } from "@apollo/react-hooks"
import { UPDATE_MASCOT_MUTATION } from "../../graphQL/mutations"

// libraries
import { Carousel } from "react-responsive-carousel"
import "react-responsive-carousel/lib/styles/carousel.min.css"

// components
import VeryHappyMascot from "../../images/mascots/user-mascot/0-0.svg"
import VeryHappyGirlyMascot from "../../images/mascots/user-mascot/1-0.svg"
import VeryHappyCleverMascot from "../../images/mascots/user-mascot/2-0.svg"

// sub components
import Button from "../button/Button"
// import { NetworkStatus } from "apollo-boost"

function Mascots() {
  const history = useHistory()
  let mascotID = 0

  // context api
  const currentUser = useCurrentUserValue()

  // mutation ----------------
  const [updateMascot, { id }] = useMutation(UPDATE_MASCOT_MUTATION)

  // form specific ----------------
  const { handleSubmit } = useForm()
  const onSubmit = async formData => {
    handleMascot({ formData, updateMascot, history })

    console.log(formData)
  }

  return (
    <div className="mascots">
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-2"></div>
          <div className="col-md-7 mascots__inner">
            <div className="mascots__inner__heading">
              <h2>Almost there...</h2>
            </div>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="mascots__inner--box box-content"
            >
              <div className="mascots__inner--box__sub-heading">
                <p>
                  Choose your mascot, <br />
                  you can change it afterwards in your profile
                </p>
              </div>

              <div className="mascots__inner--box__carousel">
                <Carousel
                  id="mascot"
                  showStatus={false}
                  showThumbs={false}
                  infiniteLoop={true}
                  showIndicators={false}
                  useKeyboardArrows={true}
                  onChange={id => {
                    mascotID = id
                  }}
                >
                  <div className="container">
                    <img
                      className="container__img"
                      src={VeryHappyMascot}
                      alt="a very happy mascot"
                    />
                  </div>
                  <div className="container">
                    <img
                      className="container__img"
                      src={VeryHappyGirlyMascot}
                      alt="a very happy girly mascot"
                    />
                  </div>
                  <div className="container">
                    <img
                      className="container__img"
                      src={VeryHappyCleverMascot}
                      alt="a very happy clever mascot"
                    />
                  </div>
                </Carousel>

                <div className="mascots__inner__btn">
                  <Button
                    variant="button"
                    text="Save"
                    className="stan-btn-primary"
                  />
                </div>
              </div>
            </form>
          </div>
          <div className="col-md-3"></div>
        </div>
      </div>
    </div>
  )
}

export default Mascots

async function handleMascot({ formData, updateMascot, history }) {
  try {
    const resp = await updateMascot({
      variables: {
        mascot: 1,
      },
    })

    if (resp && resp.data && resp.data.updateMascot) {
      console.log("success: saved new mascot")
    } else {
      throw new Error("failed: saved new mascot")
    }
    // redirect
    // history.push("/")
    // window.location.reload()
  } catch (err) {
    //TODO: USER DEN ERROR MITTEILEN
    console.error(err.message)
    // console.log(err)
  }
}
