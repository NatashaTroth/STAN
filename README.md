//Adding react

➜ create-react-app client --use-npm

 npm start
    Starts the development server.

  npm run build
    Bundles the app into static files for production.

  npm test
    Starts the test runner.

  npm run eject
    Removes this tool and copies build dependencies, configuration files
    and scripts into the app directory. If you do this, you can’t go back!

We suggest that you begin by typing:

  cd client
  npm start

  -> npm install apollo-boost @apollo/react-hooks graphql



!!! npm install cors - so can get stuff from backend (different) server - otherwise cors blocks it

// //dummy data
// var books = [
//     {name: 'Name of the Wind', genre: 'Fantasy', id:'1', authorId: '1'},
//     {name: 'The Final Empire', genre: 'Fantasy', id:'2', authorId: '2'},
//     {name: 'The Long Earth', genre: 'Sci-Fi', id:'3', authorId: '3'},
//     {name: 'The Hero of Ages', genre: 'Fantasy', id:'4', authorId: '2'},
//     {name: 'The Colour of Magic', genre: 'Fantasy', id:'5', authorId: '3'},
//     {name: 'The Light Fantastic', genre: 'Fantasy', id:'6', authorId: '3'}

// ]
// var authors = [
//     {name: 'Patrick Rothfuss', age: 44, id:'1'},
//     {name: 'Brandon Sanderson', age: 42, id:'2'},
//     {name: 'Terry Pratchett', age: 66, id:'3'}

// ]


5e1f41a62d06826ca6530c6c
5e1f41b62d06826ca6530c6d
5e1f41f02d06826ca6530c6e

{
  book{
    id
    name
    author{
      name
      age
    }
  }
}

//adds author, and returns the name and age of said author
mutation {
   addAuthor(name: "Shaun", age: 30){
    name
    age
  }
}

mutation {
   addBook(name: "The Long Earth", genre: "Sci-Fi", authorId: "5e1f3baae254bd6c26a0045e"){
    name
    genre
    
  }
}
