import React, { useState, useEffect } from "react"

import Navigation from "./Routing"
import "./App.scss"
// import ApolloClient from "apollo-boost"
import { ApolloProvider } from "@apollo/react-hooks" //inserts received data into our app
import { getAccessToken, setAccessToken } from "./accessToken"

import { ApolloClient } from "apollo-client"
import { InMemoryCache } from "apollo-cache-inmemory"
import { HttpLink } from "apollo-link-http"
import { onError } from "apollo-link-error"

import { ApolloLink, Observable } from "apollo-link"
import jwtDecode from "jwt-decode"
import { TokenRefreshLink } from "apollo-link-token-refresh"

const cache = new InMemoryCache({})

//src: https://www.apollographql.com/docs/react/migrating/boost-migration/#advanced-migration
const requestLink = new ApolloLink(
  (operation, forward) =>
    new Observable(observer => {
      let handle
      Promise.resolve(operation)
        .then(oper => {
          //from old apollo boost client
          const accessToken = getAccessToken()
          if (accessToken) {
            oper.setContext({
              headers: {
                authorization: accessToken ? `bearer ${accessToken}` : "",
              },
            })
          }
        })
        .then(() => {
          handle = forward(operation).subscribe({
            next: observer.next.bind(observer),
            error: observer.error.bind(observer),
            complete: observer.complete.bind(observer),
          })
        })
        .catch(observer.error.bind(observer))

      return () => {
        if (handle) handle.unsubscribe()
      }
    })
)

const client = new ApolloClient({
  link: ApolloLink.from([
    new TokenRefreshLink({
      accessTokenField: "accessToken",
      isTokenValidOrUndefined: () => {
        //checks if token is valid
        const token = getAccessToken()

        if (!token) {
          return true
        }

        try {
          //exp = expires
          const { exp } = jwtDecode(token)
          if (Date.now() >= exp * 1000) {
            return false
          } else {
            return true
          }
        } catch (err) {
          console.log(err)
          return false
        }
      },
      fetchAccessToken: () => {
        //if token is not valid
        return fetch("http://localhost:5000/refresh_token", {
          method: "POST",
          credentials: "include",
          // headers: {},
        })
      },
      //read access token from response
      handleFetch: accessToken => {
        //set accesstoken
        setAccessToken(accessToken)
      },

      handleError: err => {
        // full control over handling token fetch Error
        console.warn("Your refresh token is invalid. Try to relogin")
        console.error(err)

        // // your custom action here
        // user.logout()
      },
    }),

    onError(({ graphQLErrors, networkError }) => {
      console.log(graphQLErrors)
      console.log(networkError)
      // if (graphQLErrors) {
      //   sendToLoggingService(graphQLErrors)
      // }
      // if (networkError) {
      //   logoutUser()
      // }
    }),
    requestLink,

    new HttpLink({
      uri: "http://localhost:5000/graphql",
      credentials: "include",
    }),
  ]),
  cache,
})

//apollo client setup
//uri = endpoint
//TODO: Change when online
// const client = new ApolloClient({
//   uri: "http://localhost:5000/graphql/",
//   onError: e => {
//     console.error(e)
//   },
//   credentials: "include",
//   request: operation => {
//     const accessToken = getAccessToken()
//     if (accessToken) {
//       operation.setContext({
//         headers: {
//           authorization: accessToken ? `bearer ${accessToken}` : "",
//         },
//       })
//     }
//   },
// })

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
