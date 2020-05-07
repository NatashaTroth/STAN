import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { useHistory } from "react-router-dom"
// --------------------------------------------------------------

// mutation & queries ----------------
import { useMutation } from "@apollo/react-hooks"
import { UPDATE_MASCOT_MUTATION } from "../../graphQL/mutations"

// libraries
import Carousel from "react-bootstrap/Carousel"

// components ----------------
import VeryHappyMascot from "../../images/mascots/user-mascot/0-0.svg"
import VeryHappyGirlyMascot from "../../images/mascots/user-mascot/1-0.svg"
import VeryHappyCleverMascot from "../../images/mascots/user-mascot/2-0.svg"

// sub components ----------------
import Button from "../button/Button"
import Image from "../image/Image"

function Mascots() {
  // form specific & routes ----------------
  const { handleSubmit } = useForm()
  let history = useHistory()

  // state ----------------
  const [index, setIndex] = useState(0)

  // mutation ----------------
  const [updateMascot] = useMutation(UPDATE_MASCOT_MUTATION)

  // form specific ----------------
  const onSubmit = () => {
    handleMascot({ index, updateMascot, history })
  }

  // functions ----------------
  const handleMascotCallback = id => {
    setIndex(id)
  }

  return (
    <div className="mascots">
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-2"></div>
          <div className="col-lg-10">
            <div className="mascots__heading">
              <h2>One more thing...</h2>
            </div>
          </div>

          <div className="col-lg-2"></div>
          <div className="col-lg-7">
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
                    activeIndex={index}
                    onSelect={handleMascotCallback}
                    wrap={false}
                    interval={null}
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

                  <div className="mascots__inner--form__button">
                    <Button
                      variant="button"
                      text="Save"
                      className="stan-btn-primary"
                    />
                  </div>
                </div>
                <div id="success-container-mascot-saved">
                  <p className="success">the exam was successfully completed</p>
                </div>
                <div className="error">
                  <p id="graphql-mascots-error"></p>
                </div>
              </form>
            </div>
          </div>
          <div className="col-lg-3"></div>
        </div>
      </div>
    </div>
  )
}

export default Mascots

async function handleMascot({ index, updateMascot, history }) {
  try {
    const resp = await updateMascot({
      variables: {
        mascot: index,
      },
    })

    if (resp && resp.data && resp.data.updateMascot) {
      document.getElementById("success-container-mascot-saved").style.display =
        "block"
    } else {
      throw new Error("The saving of mascot failed.")
    }

    // redirect ----------------
    window.localStorage.setItem("mascot-event", false)
    setTimeout(() => {
      history.push("/")
    }, 1000)
  } catch (err) {
    let element = document.getElementById("graphql-mascots-error")

    if (err.graphQLErrors && err.graphQLErrors[0]) {
      element[0].innerHTML = err.graphQLErrors[0].message
    } else {
      element[0].innerHTML = err.message
    }
  }
}
