import React from "react"
import Slider from "infinite-react-carousel"

import HappyMascot from "../../images/mascots/0-happy-0.svg"
import VeryHappyMascot from "../../images/mascots/0-veryhappy-0.svg"
import HappyGirlyMascot from "../../images/mascots/1-happy-0.svg"
import VeryHappyGirlyMascot from "../../images/mascots/1-veryhappy-0.svg"
import HappyCleverMascot from "../../images/mascots/2-happy-0.svg"
import VeryHappyCleverMascot from "../../images/mascots/2-veryhappy-0.svg"

function Mascots() {
  return (
    <div className="mascots">
      <p>Choose your mascot, you can change it afterwards in your profile</p>

      <Slider>
        <div className="mascots__container">
          <img className="mascots__img" src={HappyMascot} alt="" />
        </div>
        <div className="mascots__container">
          <img className="mascots__img" src={VeryHappyMascot} alt="" />
        </div>
        <div className="mascots__container">
          <img className="mascots__img" src={HappyGirlyMascot} alt="" />
        </div>
        <div className="mascots__container">
          <img className="mascots__img" src={VeryHappyGirlyMascot} alt="" />
        </div>
        <div className="mascots__container">
          <img className="mascots__img" src={HappyCleverMascot} alt="" />
        </div>
        <div className="mascots__container">
          <img className="mascots__img" src={VeryHappyCleverMascot} alt="" />
        </div>
      </Slider>
    </div>
  )
}

export default Mascots
