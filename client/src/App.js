import React, { useState, useEffect } from "react"

import "./App.scss"
// import ApolloClient from "apollo-boost"
import { ApolloProvider } from "@apollo/react-hooks" //inserts received data into our app
import { setAccessToken } from "./accessToken"

import { client } from "./apolloClient"

import STAN from "./components/STAN/STAN"

/* TODO: CACHING APOLLO */
const App = () => {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
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
