import React, { useState, useEffect } from "react"
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

// random number ----------------
const random = Math.floor(Math.random() * 3)

const RandomMascot = ({ mascotId, num, mood }) => {
  return (
    <Image
      path={require(`../../images/mascots/${mascotId}-${mood.replace(
        / /g,
        ""
      )}-${num}.svg`)}
      text="random mascots with different moods"
    />
  )
}

const CurrentState = () => {
  // context ----------------
  const currentUser = useCurrentUserValue()

  // state ----------------
  const [randomNum, setRandomNum] = useState({ min: 0, max: 2, num: 0 })

  // query ----------------
  const { data, loading, error } = useQuery(GET_TODAYS_CHUNKS_PROGRESS)

  useEffect(() => {
    const generateNumber = (min, max) => {
      return Math.floor(Math.random() * (max - min + 1) + min)
    }
    setInterval(() => {
      setRandomNum({ num: generateNumber(randomNum.min, randomNum.max) })
    }, 30000)
  }, [])

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
      <RandomMascot
        mascotId={currentUser.mascot}
        num={randomNum.num}
        mood={mood}
      />
      <div className="current-state__motivation">
        <p>{motivation}</p>
      </div>
    </div>
  )
}

export default CurrentState
