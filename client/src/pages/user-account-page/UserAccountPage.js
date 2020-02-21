import React from "react"
// import Button from "../../components/button/Button"
import { setAccessToken } from "../../accessToken"
import { LOGOUT_MUTATION } from "../../graphQL/mutations"
import { useMutation } from "@apollo/react-hooks"
import { useHistory } from "react-router-dom"

function UserAccount() {
  const [logout, { client }] = useMutation(LOGOUT_MUTATION)
  const history = useHistory()

  return (
    <div className="navigation__title">
      {/* TODO: ONLY DISPLAY LOGOUT BUTTON IF LOGGED IN */}
      <h2>User Account </h2>
      <button
        onClick={async () => {
          //reset refresh token
          await logout()
          //reset access token
          setAccessToken("")
          //reset apollo client- always good after logout
          //TODO: DELETE IF APOLLO STORE IS NOT BEING USED
          await client.resetStore()
          history.push("/login")
        }}
      >
        Logout
      </button>
    </div>
  )
}

export default UserAccount
