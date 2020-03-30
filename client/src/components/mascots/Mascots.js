import React from "react"
import { Carousel } from "react-responsive-carousel"
import "react-responsive-carousel/lib/styles/carousel.min.css"

import HappyMascot from "../../images/mascots/user-mascot/0.svg"
import VeryHappyMascot from "../../images/mascots/user-mascot/1.svg"
import HappyGirlyMascot from "../../images/mascots/user-mascot/2.svg"
import VeryHappyGirlyMascot from "../../images/mascots/user-mascot/3.svg"
import HappyCleverMascot from "../../images/mascots/user-mascot/4.svg"
import VeryHappyCleverMascot from "../../images/mascots/user-mascot/5.svg"

function Mascots() {
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
      >
        <div className="container">
          <img className="container__img" src={HappyMascot} alt="" />
        </div>
        <div className="container">
          <img className="container__img" src={VeryHappyMascot} alt="" />
        </div>
        <div className="container">
          <img className="container__img" src={HappyGirlyMascot} alt="" />
        </div>
        <div className="container">
          <img className="container__img" src={VeryHappyGirlyMascot} alt="" />
        </div>
        <div className="container">
          <img className="container__img" src={HappyCleverMascot} alt="" />
        </div>
        <div className="container">
          <img className="container__img" src={VeryHappyCleverMascot} alt="" />
        </div>
      </Carousel>
    </div>
  )
}

export default Mascots
