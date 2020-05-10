import React from "react"
// --------------------------------------------------------------

// query ----------------
import { CURRENT_USER } from "../../graphQL/queries"

// components ----------------
import Image from "../../components/image/Image"
import { currentMood } from "../../pages/user-account-page/UserAccountPage"

// motivational sayings ----------------
import motivationalSayings from "./json/motivational-sayings.json"

// libraries
import Carousel from "react-bootstrap/Carousel"

// apolloClient cache ----------------
import { client } from "../../apolloClient"

// random number ----------------
const random = Math.floor(Math.random() * 3)

const CurrentState = ({ todaysProgress }) => {
  // context ----------------
  const currentUser = client.readQuery({ query: CURRENT_USER }).currentUser

  // variables ----------------
  let mood = "okay"
  let motivation

  // run query in cache ----------------
  mood = currentMood(todaysProgress)

  motivationalSayings.forEach(element => {
    if (mood === element.mood) {
      if (element.id === random) {
        motivation = element.motivation
      }
    }
  })

  // return ----------------
  return (
    <div className="current-state">
      <div className="current-state__mascot">
        <Carousel
          wrap={true}
          interval={30000}
          indicators={false}
          controls={false}
          autoPlay={true}
        >
          <Carousel.Item>
            <Image
              path={require(`../../images/mascots/${
                currentUser.mascot
              }-${mood.replace(/ /g, "")}-0.svg`)}
              text=""
            />
          </Carousel.Item>

          <Carousel.Item>
            <Image
              path={require(`../../images/mascots/${
                currentUser.mascot
              }-${mood.replace(/ /g, "")}-1.svg`)}
              text=""
            />
          </Carousel.Item>

          <Carousel.Item>
            <Image
              path={require(`../../images/mascots/${
                currentUser.mascot
              }-${mood.replace(/ /g, "")}-2.svg`)}
              text=""
            />
          </Carousel.Item>
        </Carousel>
      </div>
      <div className="current-state__motivation">
        <p>{motivation}</p>
      </div>
    </div>
  )
}

export default CurrentState
