import React, { useState, useEffect } from "react"

import Navigation from "./Routing"
import "./App.scss"
// import ApolloClient from "apollo-boost"
import { ApolloProvider } from "@apollo/react-hooks" //inserts received data into our app
import { setAccessToken } from "./accessToken"

import { client } from "./apolloClient"

//TODO: CACHING APOLLO

function App() {
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

  if (loading) {
    return <div>loading...</div>
  }

  return (
    <ApolloProvider client={client}>
      <div className="App">
        <header className="App-header">
          <h1 className="hide">Stan - online study plan</h1>
          <Navigation></Navigation>
        </header>
      </div>
    </ApolloProvider>
  )
}

export default App
