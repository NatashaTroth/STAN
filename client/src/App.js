import React, { useState, useEffect } from "react"

import Navigation from "./Routing"
import "./App.scss"
import ApolloClient from "apollo-boost"
import { ApolloProvider } from "@apollo/react-hooks" //inserts received data into our app
import { getAccessToken, setAccessToken } from "./accessToken"

//apollo client setup
//uri = endpoint
//TODO: Change when online
const client = new ApolloClient({
  uri: "http://localhost:5000/graphql/",
  onError: e => {
    console.error(e)
  },
  credentials: "include",
  request: operation => {
    const accessToken = getAccessToken()
    if (accessToken) {
      operation.setContext({
        headers: {
          authorization: accessToken ? `bearer ${accessToken}` : "",
        },
      })
    }
  },
})

function App() {
  const [loading, setLoading] = useState(true)
  //TODO: CORS - MAKE SURE IT IS SECURE
  useEffect(() => {
    // console.log("test1")
    fetch("http://localhost:5000/refresh_token", {
      method: "POST",
      credentials: "include",
      // headers: {},
    })
      .then(async resp => {
        // console.log("test2")
        // console.log(resp)
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
