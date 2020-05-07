import React from "react"
import { useQuery } from "@apollo/react-hooks"
// --------------------------------------------------------------

// context ----------------
import { useCurrentUserValue } from "../../components/STAN/STAN"

// query ----------------
import { GET_TODAYS_CHUNKS_PROGRESS } from "../../graphQL/queries"

// components ----------------
import Image from "../../components/image/Image"
import Loading from "../../components/loading/Loading"
import QueryError from "../error/Error"
import { currentMood } from "../../pages/user-account-page/UserAccountPage"

// motivational sayings ----------------
import motivationalSayings from "./json/motivational-sayings.json"

// libraries ----------------
import Carousel from "react-bootstrap/Carousel"

// random number ----------------
const random = Math.floor(Math.random() * 3)

const CurrentState = () => {
  const currentUser = useCurrentUserValue()

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
      <Carousel indicators={false} controls={false} interval={1000}>
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

      <div className="current-state__motivation">
        <p>{motivation}</p>
      </div>
    </div>
  )
}

export default CurrentState
