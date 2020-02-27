import React, { Component } from "react"
import { Redirect } from "react-router-dom"
import Cookies from "js-cookie"

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
      fetch("/refresh_token")
        .then(res => {
          if (res.status === 200) {
            this.setState({ loading: false })
          } else {
            const error = new Error(res.error)
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

      let value = Cookies.get("refresh_token", {
        domain: "localhost",
        path: "/refresh_token",
      })

      if (redirect) {
        return <Redirect to="/login" />
      }

      return <ComponentToProtect {...this.props} />
    }
  }
}

export default WithAuth
