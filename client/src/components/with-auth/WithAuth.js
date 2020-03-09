import React, { Component } from "react"
import { Redirect } from "react-router-dom"
import axios from "axios"

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
      axios
        .post("http://localhost:5000/refresh_token", this.state)
        .then(response => {
          console.log(response.data)
          // if (response.data.ok) {
          //   this.setState({ loading: false })
          // } else {
          // const error = new Error(response.error)
          // throw error
          // }
        })
        .catch(error => {
          // console.log(error)
          // this.setState({ loading: false, redirect: true })
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
