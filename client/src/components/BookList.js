import React, { Component, useState } from "react"
import { useQuery } from "@apollo/react-hooks"
import { GET_BOOKS_QUERY } from "../queries/queries"
//doc for apollo: https://www.apollographql.com/docs/react/get-started/

// components
import BookDetails from "./BookDetails"

function BookList() {
  const { loading, error, data } = useQuery(GET_BOOKS_QUERY)
  const [bookId, setBookId] = useState("")

  //console.log(data) //this console.log outputs in the browser console

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error :(</p>

  return (
    <div>
      <div className="container">
        {data.books.map(({ id, name }) => (
          <div
            key={id}
            className="book-link"
            onClick={e => {
              setBookId(id)
            }}
          >
            <p>{name}</p>
          </div>
        ))}
      </div>
      <BookDetails bookId={bookId}></BookDetails>
    </div>
  )
}

export default BookList
