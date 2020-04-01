import React, { useState, useStore } from "react"
import { useHistory } from "react-router-dom"
// --------------------------------------------------------------

// state
import {
  CurrentUserContext,
  useCurrentUserValue,
} from "../../components/STAN/STAN"

// mutation & queries
import { useQuery, useMutation } from "@apollo/react-hooks"
import { UPDATE_MASCOT_MUTATION } from "../../graphQL/mutations"
import { CURRENT_USER } from "../../graphQL/queries"

// libraries
import { Carousel } from "react-responsive-carousel"
import "react-responsive-carousel/lib/styles/carousel.min.css"

// components
import VeryHappyMascot from "../../images/mascots/user-mascot/0-0.svg"
import VeryHappyGirlyMascot from "../../images/mascots/user-mascot/1-0.svg"
import VeryHappyCleverMascot from "../../images/mascots/user-mascot/2-0.svg"

// sub components
import Button from "../button/Button"
import { NetworkStatus } from "apollo-boost"

function Mascots() {
  const history = useHistory()

  // context api
  const currentUser = useCurrentUserValue()

  // mutation ----------------
  const [updateMascot, { mascotId }] = useMutation(UPDATE_MASCOT_MUTATION)
  const { data, loading, error } = useQuery(CURRENT_USER)
  const [stan, setStan] = useState(0)

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error :(</p>

  const handlePath = path => {
    history.push(path)
  }

  const getMascotCallback = id => {
    // currentUser.mascot = id // store new mascot id in provider
    // setStan(id)
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
              onSubmit={mascot => {
                mascot.preventDefault()
                updateMascot({
                  variables: {
                    mascot: 2,
                  },
                })
              }}
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
                  showStatus={false}
                  showThumbs={false}
                  infiniteLoop={true}
                  showIndicators={false}
                  useKeyboardArrows={true}
                  onChange={getMascotCallback}
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
                    type="submit"
                    variant="button"
                    className="stan-btn-primary"
                    text="Save"
                    onClick={() => handlePath("/")}
                    // onSubmit={mascot => {
                    //   mascot.preventDefault()
                    //   updateMascot({
                    //     variables: {
                    //       mascot: 2,
                    //     },
                    //   })
                    // }}
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
