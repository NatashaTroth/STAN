import React, { useState, useEffect } from "react"
import { setAccessToken } from "./accessToken"
import { BrowserRouter as Router, Redirect } from "react-router-dom"
import "./App.scss"
// --------------------------------------------------------------

// inserts received data into our app ----------------
import { ApolloProvider } from "@apollo/react-hooks"

import { client } from "./apolloClient"

// components ----------------
import STAN from "./components/STAN/STAN"
import Loading from "./components/loading/Loading"

// preloader animation ----------------
import { Cube } from "react-preloaders"

// redirect function ----------------
const RedirectPopup = () => {
  return (
    <Router>
      <Redirect to="/popup" />
    </Router>
  )
}

/* TODO: CACHING APOLLO */
const App = () => {
  const [loading, setLoading] = useState(true)

  // TODO: LOGOUT-ALL-TABS
  window.addEventListener("storage", e => {
    if (e.key === "logout-event") {
      localStorage.removeItem("logout-event")

      RedirectPopup()
      localStorage.setItem("popup-event", true)
      window.location.href = "/popup"
    }
  })

  useEffect(() => {
    fetch("/refresh_token", {
      method: "POST",
      credentials: "include",
    })
      .then(async resp => {
        const { accessToken } = await resp.json()
        setAccessToken(accessToken)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
      })

    // in case a second tab wasn't open, to make sure it is deleted
    localStorage.removeItem("logout-event")
  }, [])

  if (loading) return <Loading />

  return (
    <ApolloProvider client={client}>
      <header>
        <h1 className="hide">Stan - online study plan</h1>
      </header>

      <STAN />
      <Cube customLoading={loading} background="#ffffff" />
    </ApolloProvider>
  )
}

export default App
