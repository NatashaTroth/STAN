import React from "react"
import { useForm } from "react-hook-form"
// --------------------------------------------------------------

// mutation & queries ----------------
import { useMutation } from "@apollo/react-hooks"
import { UPDATE_MASCOT_MUTATION } from "../../graphQL/mutations"

// libraries
import { Carousel } from "react-responsive-carousel"
import "react-responsive-carousel/lib/styles/carousel.min.css"

// components ----------------
import VeryHappyMascot from "../../images/mascots/user-mascot/0-0.svg"
import VeryHappyGirlyMascot from "../../images/mascots/user-mascot/1-0.svg"
import VeryHappyCleverMascot from "../../images/mascots/user-mascot/2-0.svg"

// sub components ----------------
import Button from "../button/Button"
import Image from "../image/Image"

function Mascots() {
  const { handleSubmit } = useForm()

  // mutation ----------------
  const [updateMascot] = useMutation(UPDATE_MASCOT_MUTATION)
  const mascotStore = { mascot: 0 }

  // form specific ----------------
  const onSubmit = async data => {
    data = mascotStore.mascot
    handleMascot({ data, updateMascot })
  }

  // functions ----------------
  const handleMascotCallback = id => {
    mascotStore.mascot = id
  }

  return (
    <div className="mascots">
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-2"></div>
          <div className="col-md-10">
            <div className="mascots__heading">
              <h2>One more thing...</h2>
            </div>
          </div>

          <div className="col-md-2"></div>
          <div className="col-md-7">
            <div className="mascots__inner">
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="mascots__inner--form box-content"
              >
                <div className="mascots__inner--form__sub-heading">
                  <p>
                    Choose your mascot, <br />
                    you can change it afterwards in your profile
                  </p>
                </div>

                <div className="mascots__inner--form__carousel">
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

                  <div className="mascots__inner--form__button">
                    <Button
                      variant="button"
                      text="Save"
                      className="stan-btn-primary"
                    />
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div className="col-md-3"></div>
        </div>
      </div>
    </div>
  )
}

export default Mascots

async function handleMascot({ data, updateMascot }) {
  try {
    const resp = await updateMascot({
      variables: {
        mascot: data,
      },
    })

    if (resp && resp.data && resp.data.updateMascot) {
      console.log("success: saved new mascot")
    } else {
      throw new Error("failed: saved new mascot")
    }
    // redirect
    window.localStorage.setItem("mascot-event", false)
    window.location.reload()
  } catch (err) {
    //TODO: USER DEN ERROR MITTEILEN
    console.error(err.message)
    // console.log(err)
  }
}
