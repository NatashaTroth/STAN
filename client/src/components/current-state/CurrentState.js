import React from "react"
// --------------------------------------------------------------

// context ----------------
import { CurrentUserContext } from "../../components/STAN/STAN"

// query ----------------
import { GET_TODAYS_CHUNKS_PROGRESS } from "../../graphQL/queries"

// sub-components ----------------
import Image from "../../components/image/Image"
import Loading from "../../components/loading/Loading"
import { currentMood } from "../../pages/user-account-page/UserAccountPage"

// motivational sayings ----------------
import motivationalSayings from "./json/motivational-sayings.json"

// libraries ----------------
import { Carousel } from "react-responsive-carousel"
import "react-responsive-carousel/lib/styles/carousel.min.css"
import { useQuery } from "@apollo/react-hooks"
import QueryError from "../error/Error"

// random number ----------------
const random = Math.floor(Math.random() * 3)

const CurrentState = () => {
  // query ----------------
  const { data, loading, error } = useQuery(GET_TODAYS_CHUNKS_PROGRESS)

  // variables ----------------
  let mood = "okay"
  let motivation

  // error handling ----------------
  if (loading) return <Loading />
  if (error) return <QueryError errorMessage={error.message} />
  if (data) {
    mood = currentMood(data.todaysChunksProgress)
  }

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
      <Carousel
        showStatus={false}
        showThumbs={false}
        infiniteLoop={true}
        showIndicators={false}
        autoPlay={true}
        showArrows={false}
        interval={30000}
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
