import React, { useState, useEffect } from "react"

import "./App.scss"
// import ApolloClient from "apollo-boost"
import { ApolloProvider } from "@apollo/react-hooks" //inserts received data into our app
import { setAccessToken, getAccessToken } from "./accessToken"
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
    if (e.key == "logout-event") {
      localStorage.removeItem("logout-event")
      //TODO: go to login and inform user that logout occurred

      RedirectPopup()
      // history.push("/popup")
      window.location.replace("/popup")
      // window.location.reload()
    }
  })

  useEffect(() => {
    // TODO: if save accesstoken in store, use the if - but if only save in memory delete
    //if (!getAccessToken()) {
    fetch("http://localhost:5000/refresh_token", {
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
  }, [])

  // componentWillUnmount() {
  //   ChatAPI.unsubscribeFromFriendStatus(
  //     this.props.friend.id,
  //     this.handleStatusChange
  //   );
  // }

  if (loading) {
    return <div>loading...</div>
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
