import React, { useState } from "react"
import { Carousel } from "react-responsive-carousel"
import "react-responsive-carousel/lib/styles/carousel.min.css"

// components
import VeryHappyMascot from "../../images/mascots/user-mascot/0.svg"
import VeryHappyGirlyMascot from "../../images/mascots/user-mascot/1.svg"
import VeryHappyCleverMascot from "../../images/mascots/user-mascot/2.svg"

function Mascots({ getMascotCallback }) {
  return (
    <div className="mascots">
      <div className="mascots__sub-heading">
        <p>
          Choose your mascot, <br />
          you can change it afterwards in your profile
        </p>
      </div>

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
    </div>
  )
}

export default Mascots
