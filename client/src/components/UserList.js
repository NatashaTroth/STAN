import React, { Component, useState } from "react"
import { useQuery } from "@apollo/react-hooks"
import { GET_USERS_QUERY } from "../queries/queries"
//doc for apollo: https://www.apollographql.com/docs/react/get-started/

// components
import BookDetails from "./BookDetails"

function UserList() {
  const { loading, error, data } = useQuery(GET_USERS_QUERY)
  const [bookId, setBookId] = useState("")

  //console.log(data) //this console.log outputs in the browser console

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error :(</p>

  return (
    <div>
      <div className="container">
        {data.users.map(({ id, username, email, photoLink, mascot }) => (
          <div
            key={id}
            className="book-link"
            onClick={e => {
              setBookId(id)
            }}
          >
            <p>
              username: {username} <br />
              email: {email} <br />
              photoLink: {photoLink} <br />
              mascotNr: {mascot}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default UserList
