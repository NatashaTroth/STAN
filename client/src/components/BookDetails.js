import React, {Component, useState} from 'react'
import { useQuery, useMutation } from '@apollo/react-hooks';
import {GET_BOOK_QUERY} from '../queries/queries'

function BookDetails({bookId}) {
  const { loading, error, data  } = useQuery(GET_BOOK_QUERY, {
    variables: { id: bookId }
  });

  if(data && data.book)
    return (
      <div id="book-details" className="container">
        <h2>{data.book.name}</h2>
        <p>{data.book.genre}</p>
        <p>{data.book.author.name}</p>
        <h3>All books by this author:</h3>
        <ul>
          {data.book.author.books.map(item => {
            return <li key={item.id}>{item.name}</li>
          })}
        </ul>
      </div>
    );
  else
    return (
      <div id="book-details" className="container">
        <h2>Click on a book to display the info here</h2>
      </div>
    );
}

export default BookDetails;