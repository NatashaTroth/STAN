//TODO: Extract middlewares into separate file??
//TODO: change require to import
const express = require("express");
const { typeDefs } = require("./typedefs");
const { resolvers } = require("./resolvers");
const mongoose = require("mongoose");
const cors = require("cors");
const { ApolloServer, gql } = require("apollo-server-express");
const app = express();
const PORT = process.env.PORT || 5000;
const { makeExecutableSchema } = require("apollo-server");
const connectionString = "mongodb://localhost/MMP3";

// const LocalStrategy = require("passport-local").Strategy;
const session = require("express-session");
const uuid = require("uuid/v4");
// import User from "./#testUsers";

//TODO: for ease of implementation we hard-coded the secret, but taking it from environment variables would be the way to go for a production environment
//you would want to set the cookie to secure mode so that it is only sent via https. You can use the cookie option for this: cookie: { secure: true }
//https://jkettmann.com/authentication-and-authorization-with-graphql-and-passport/

//Express Session
// app.use(
//   session({
//     secret: "secret",
//     resave: true,
//     saveUninitialized: true,
//     cookie: { secure: true }
//   })
// );

mongoose
  .connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("connected to db"))
  .catch(e => console.error(e.message));

const schema = makeExecutableSchema({
  typeDefs,
  resolvers
});

const server = new ApolloServer({
  schema,
  context: ({ req, res }) => ({ req, res }),
  playground: {
    settings: {
      "request.credentials": "same-origin"
    }
  }
});
server.applyMiddleware({ app });

app.listen({ port: PORT }, () =>
  console.log(`🚀 Server ready at http://localhost:5000${server.graphqlPath}`)
);
