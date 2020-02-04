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
const isAuth = require("./middleware/is-auth");

// const LocalStrategy = require("passport-local").Strategy;
// const session = require("express-session");
const uuid = require("uuid/v4");

mongoose
  .connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("connected to db"))
  .catch(e => console.error(e.message));

app.use(isAuth);

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
