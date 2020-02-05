import React from "react"
import Navigation from "./Routing"
import "./App.scss"
import ApolloClient from "apollo-boost"
import { ApolloProvider } from "@apollo/react-hooks" //inserts received data into our app

//apollo client setup
//uri = endpoint
//TODO: Change when online
const client = new ApolloClient({
  uri: "http://localhost:5000/graphql/",
  onError: e => {
    console.log(e)
  },
})

function App() {
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
