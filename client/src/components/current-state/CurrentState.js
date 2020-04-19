import React from "react"
// --------------------------------------------------------------

// context ----------------
import {
  CurrentUserContext,
  useCurrentUserValue,
} from "../../components/STAN/STAN"

// components ----------------
import Image from "../../components/image/Image"

// motivational sayings ----------------
import data from "./json/motivational-sayings.json"

// libraries ----------------
import { Carousel } from "react-responsive-carousel"
import "react-responsive-carousel/lib/styles/carousel.min.css"

const random = Math.floor(Math.random() * 3)

const CurrentState = () => {
  let mood = "very stressed"
  let motivation

  data.forEach(element => {
    if (mood === element.mood) {
      if (element.id === random) {
        motivation = element.motivation
      }
    }
  })

  // return ----------------
  return (
    <div className="current-state">
      <Carousel
        showStatus={false}
        showThumbs={false}
        infiniteLoop={true}
        showIndicators={false}
        autoPlay={true}
        showArrows={false}
      >
        <CurrentUserContext.Consumer>
          {currentUser => (
            <Image
              path={require(`../../images/mascots/${
                currentUser.mascot
              }-${mood.replace(/ /g, "")}-0.svg`)}
              text=""
            />
          )}
        </CurrentUserContext.Consumer>

        <CurrentUserContext.Consumer>
          {currentUser => (
            <Image
              path={require(`../../images/mascots/${
                currentUser.mascot
              }-${mood.replace(/ /g, "")}-1.svg`)}
              text=""
            />
          )}
        </CurrentUserContext.Consumer>

        <CurrentUserContext.Consumer>
          {currentUser => (
            <Image
              path={require(`../../images/mascots/${
                currentUser.mascot
              }-${mood.replace(/ /g, "")}-2.svg`)}
              text=""
            />
          )}
        </CurrentUserContext.Consumer>
      </Carousel>

      <div className="current-state__motivation">
        <p>{motivation}</p>
      </div>
    </div>
  )
}

export default CurrentState
