import React, { useState, Component, useEffect } from "react"

import "./App.scss"
// import ApolloClient from "apollo-boost"
import { ApolloProvider } from "@apollo/react-hooks" //inserts received data into our app
import { setAccessToken } from "./accessToken"

import { client } from "./apolloClient"

// Navigation bar
import Navbar from "./components/navbar/Navbar"
import Backdrop from "./components/backdrop/Backdrop"
import Toolbar from "./components/toolbar/Toolbar"

/* TODO: CACHING APOLLO */

class App extends Component {
  state = {
    sideDrawerOpen: false,
    loading: true,
  }
  // const [loading, setLoading] = useState(true)

  componentDidMount = () => {
    fetch("http://localhost:5000/refresh_token", {
      method: "POST",
      credentials: "include",
    })
      .then(async resp => {
        const { accessToken } = await resp.json()
        setAccessToken(accessToken)
        this.setState({ loading: false })
      })
      .catch(err => {
        console.error(err)
      })
  }

  // componentWillUnmount() {
  //   ChatAPI.unsubscribeFromFriendStatus(
  //     this.props.friend.id,
  //     this.handleStatusChange
  //   );
  // }

  drawerToggleClickHandler = () => {
    this.setState(prevState => {
      return { sideDrawerOpen: !prevState.sideDrawerOpen }
    })
  }

  backdropClickHandler = () => {
    this.setState({ sideDrawerOpen: false })
  }

  render() {
    let backdrop
    let nav
    if (this.state.sideDrawerOpen) {
      backdrop = <Backdrop click={this.backdropClickHandler} />
      nav = <Navbar />
    }

    if (this.state.loading) {
      return <div>loading...</div>
    }

    return (
      <ApolloProvider client={client}>
        <div className="App" style={{ height: "100%" }}>
          <h1 className="hide">Stan - online study plan</h1>
          <Toolbar drawerClickHandler={this.drawerToggleClickHandler} />
          <Navbar show={this.state.sideDrawerOpen} />
          {backdrop}
          {/* {nav} */}
          {/* <Toolbar />
          <Navbar /> */}
        </div>
      </ApolloProvider>
    )
  }
}

export default App
