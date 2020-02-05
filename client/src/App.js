import React, { useState } from "react"

import Navigation from "./Routing"

// import logo from "./logo.svg";
import "./App.scss"

import ApolloClient from "apollo-boost"
import { ApolloProvider } from "@apollo/react-hooks" //inserts received data into our app

// components
// import BookList from "./components/BookList";
// import UserList from "./components/UserList";
// import AddBook from "./components/AddBook";

//apollo client setup
//uri = endpoint
//TODO: Change when online
const client = new ApolloClient({
  uri: "http://localhost:5000/graphql/",
  onError: e => {
    console.log(e)
  },
})

function App() {
  // set the state to false when menu should be hidden when app is rendered
  const [open, setOpen] = useState(true)

  return (
    <ApolloProvider client={client}>
      <div className="App">
        <header className="App-header">
          <Navigation></Navigation>
        </header>
        {/* <UserList></UserList> */}
        {/* <BookList></BookList> */}
        {/* <AddBook></AddBook> */}
      </div>
    </ApolloProvider>
  )
}

export default App
