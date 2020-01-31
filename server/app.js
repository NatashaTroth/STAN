const express = require('express')
// const graphqlHTTP = require('express-graphql')
const typeDefs = require('./schema/schema')
const resolvers = require('./resolvers/resolvers')
const mongoose = require('mongoose')
const cors = require('cors')
// import { graphqlExpress } from 'apollo-server-express';
// const bodyParser = require('body-parser');
// const {graphqlExpress} = require('apollo-server-express')
const { ApolloServer, gql } = require('apollo-server-express');
const app = express()
const PORT = process.env.PORT || 5000
app.use(cors())

// const IN_PROD = NODE
//TODO: disallow graphql playground in production environment

// const typeDefs = gql`
//   type Query {
//     hello: String
//   }
// `;

// console.log(typeDefs)

// const resolvers = {
//   // Query: {
//   //   hello: () => 'Hello world!'
//   // },
// };

//TODO: MOVE TO SECURE FILE
// const connectionString = "mongodb+srv://natasha:Bb6wHRMVqH8ODlVD@cluster0-abb8v.mongodb.net/test"

const connectionString = "mongodb://localhost/MMP3"

mongoose.connect(connectionString, {useNewUrlParser: true, useUnifiedTopology: true}, () =>{
  //console.log("connected to db")
})
.then (() => console.log("connected to db"))
.catch((e) => console.error(e.message))


// var dbUrl = 'mongodb+srv://natasha:Bb6wHRMVqH8ODlVD@cluster0-abb8v.mongodb.net/test'
// mongoose.connect(dbUrl, {useNewUrlParser: true, useUnifiedTopology: true});
// mongoose.Promise = global.Promise;
// var db = mongoose.connection;
// db.on('error', console.error.bind(console, "DB connection error"))





// const server = new ApolloServer({ typeDefs, resolvers });
const server = new ApolloServer({ typeDefs, resolvers });
server.applyMiddleware({ app });

app.listen({ port: PORT }, () =>
  console.log(`🚀 Server ready at http://localhost:5000${server.graphqlPath}`)
)




// //connect to mlab database
// const connectionString = "mongodb+srv://natasha:Bb6wHRMVqH8ODlVD@cluster0-abb8v.mongodb.net/test"

// mongoose.connect(connectionString, {useNewUrlParser: true, useUnifiedTopology: true}, () =>{
//   //console.log("connected to db")
// })
// .then (() => console.log("connected to db"))
// .catch((e) => console.error(e.message))


// //so can use graphql on url /graphql
// // app.use('/graphql', graphqlHTTP({
// //   schema,
// //   graphiql: true

// // }))
// app.use('/graphql', 
// bodyParser.json(), 
// graphqlExpress({ schema: myGraphQLSchema }));

// app.listen(port, () => {
//   console.log(`now listening to port ${port}`)
// })

