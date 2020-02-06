import React, { useState, Component } from "react"

import "./App.scss"
import ApolloClient from "apollo-boost"
import { ApolloProvider } from "@apollo/react-hooks" //inserts received data into our app

// Navigation bar
import Navbar from "./components/navbar/Navbar"
import Backdrop from "./components/backdrop/Backdrop"
import Toolbar from "./components/toolbar/Toolbar"

//apollo client setup
//uri = endpoint
//TODO: Change when online
const client = new ApolloClient({
  uri: "http://localhost:5000/graphql/",
  onError: e => {
    console.log(e)
  },
})

class App extends Component {
  state = {
    sideDrawerOpen: false,
  }

  drawerToggleClickeHandler = () => {
    this.setState(prevState => {
      return { sideDrawerOpen: !prevState.sideDrawerOpen }
    })
  }

  backdropClickHandler = () => {
    this.setState({ sideDrawerOpen: false })
  }

  render() {
    let backdrop

    if (this.state.sideDrawerOpen) {
      backdrop = <Backdrop click={this.backdropClickHandler} />
      // nav = <Navbar />
    }

    console.log(this.state.sideDrawerOpen)
    console.log(backdrop)

    return (
      <ApolloProvider client={client}>
        <div className="App" style={{ height: "100%" }}>
          <h1 className="hide">Stan - online study plan</h1>
          {/* <Toolbar drawerClickHandler={this.drawerToggleClickHandler} /> */}
          {/* <Navbar show={this.state.sideDrawerOpen} /> */}
          {/* {backdrop} */}
          <Toolbar />
          <Navbar />
          {/* <Backdrop /> */}
        </div>
      </ApolloProvider>
    )
  }
}

export default App
