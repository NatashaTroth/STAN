import React, { useState } from "react"
import { Carousel } from "react-responsive-carousel"
import "react-responsive-carousel/lib/styles/carousel.min.css"
import { useHistory } from "react-router-dom"

// components
import VeryHappyMascot from "../../images/mascots/user-mascot/0-0.svg"
import VeryHappyGirlyMascot from "../../images/mascots/user-mascot/1-0.svg"
import VeryHappyCleverMascot from "../../images/mascots/user-mascot/2-0.svg"

// sub components
import Button from "../button/Button"

function Mascots({ getMascotCallback }) {
  const history = useHistory()

  const handlePath = path => {
    history.push(path)
  }

  return (
    <div className="mascots">
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-2"></div>
          <div className="col-md-8 mascots__inner">
            <div class="mascots__inner__heading">
              <h2>Almost there...</h2>
            </div>
            <div class="mascots__inner--box box-content">
              <div className="mascots__inner--box__sub-heading">
                <p>
                  Choose your mascot, <br />
                  you can change it afterwards in your profile
                </p>
              </div>

              <div class="mascots__inner--box__carousel">
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

                <div class="mascots__inner__btn">
                  <Button
                    variant="button"
                    className="stan-btn-primary"
                    text="Save"
                    onClick={() => handlePath("/")}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-2"></div>
        </div>
      </div>
    </div>
  )
}

export default Mascots
