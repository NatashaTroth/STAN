import React, { useState, useEffect } from "react"
import "./App.scss"
// import ApolloClient from "apollo-boost"
import { ApolloProvider } from "@apollo/react-hooks" //inserts received data into our app
import { setAccessToken } from "./accessToken"
import { BrowserRouter as Router, Redirect } from "react-router-dom"

import { client } from "./apolloClient"

// components
import STAN from "./components/STAN/STAN"

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

  //TODO-LOGOUT-ALL-TABS
  window.addEventListener("storage", e => {
    if (e.key === "logout-event") {
      localStorage.removeItem("logout-event")
      RedirectPopup()
      localStorage.setItem("popup-event", true)
      window.location.replace("/popup")
    }
  })

  useEffect(() => {
    // TODO: if save accesstoken in store, use the if - but if only save in memory delete
    //if (!getAccessToken()) {
    // fetch("http://localhost:5000/refresh_token", {
    // console.log("here:" + process.env.DOMAIN_REFRESH_TOKEN)
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
    // }

    //In case a second tab wasn't open, to make sure it is deleted
    // localStorage.removeItem("logout-event")
  }, [])

  if (loading) {
    return <p className="loading">loading...</p>
  }

  return (
    <ApolloProvider client={client}>
      <header>
        <h1 className="hide">Stan - online study plan</h1>
      </header>

      <STAN />
    </ApolloProvider>
  )
}

export default App
