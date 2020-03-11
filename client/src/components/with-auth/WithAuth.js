import React, { Component } from "react"
import { Redirect } from "react-router-dom"
import axios from "axios"
import { setAccessToken } from "../../accessToken"

function WithAuth(ComponentToProtect) {
  return class extends Component {
    constructor() {
      super()
      this.state = {
        loading: true,
        redirect: false,
      }
    }

    componentDidMount() {
      fetch("http://localhost:5000/refresh_token", {
        method: "POST",
        credentials: "include",
      })
        .then(async resp => {
          const { ok, accessToken } = await resp.json()
          if (ok) {
            setAccessToken(accessToken)
            this.setState({ loading: false })
          } else {
            const error = new Error(resp.error)
            throw error
          }
        })
        .catch(err => {
          console.error(err)
          this.setState({ loading: false, redirect: true })
        })
    }

    render() {
      const { loading, redirect } = this.state

      if (loading) {
        return null
      }

      if (redirect) {
        return <Redirect to="/login" />
      }

      return <ComponentToProtect {...this.props} />
    }
  }
}

export default WithAuth
