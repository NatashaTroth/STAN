import React, { Component, useState } from "react"
import { useQuery, useMutation } from "@apollo/react-hooks"
import {
  GET_AUTHORS_QUERY,
  ADD_BOOK_MUTATION,
  GET_BOOKS_QUERY,
} from "../queries/queries"
//doc for apollo: https://www.apollographql.com/docs/react/get-started/

function displayAuthors(data) {
  if (data.loading) return <option disabled>Loading Authors ...</option>

  return data.authors.map(({ id, name }) => {
    return (
      <option key={id} value={id}>
        {name}
      </option>
    )
  })
}

function AddBook() {
  const { loading, error, data } = useQuery(GET_AUTHORS_QUERY)
  const [name, setName] = useState("")
  const [genre, setGenre] = useState("")
  const [authorId, setAuthorId] = useState("")
  const [addBook, { mutationData }] = useMutation(ADD_BOOK_MUTATION)

  //console.log(data) //this console.log outputs in the browser console

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error :(</p>

  return (
    <form id="add-book" className="container">
      <div className="field">
        <label>Book name:</label>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
        ></input>
      </div>

      <div className="field">
        <label>Genre:</label>
        <input
          type="text"
          value={genre}
          onChange={e => setGenre(e.target.value)}
        ></input>
      </div>

      <div className="field">
        <label>Author:</label>
        <select value={authorId} onChange={e => setAuthorId(e.target.value)}>
          {displayAuthors(data)}
        </select>
      </div>

      {/* //RefetchQueries are the queries that need to be re fetched from the db (updated), after executing the mutation */}
      <button
        onClick={e => {
          e.preventDefault()
          console.log("in onclick")
          addBook({
            variables: {
              name: name,
              genre: genre,
              authorId: authorId,
            },
            refetchQueries: [{ query: GET_BOOKS_QUERY }],
          })
        }}
      >
        Add
      </button>
    </form>
  )
}

export default AddBook
