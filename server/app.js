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

const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const session = require("express-session");
const uuid = require("uuid/v4");
//Passport config
require("./config/passport")(passport);

import User from "./#testUsers";

//TODO: for ease of implementation we hard-coded the secret, but taking it from environment variables would be the way to go for a production environment
//you would want to set the cookie to secure mode so that it is only sent via https. You can use the cookie option for this: cookie: { secure: true }
//https://jkettmann.com/authentication-and-authorization-with-graphql-and-passport/

//Express Session
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
    cookie: { secure: true }
  })
);

//intialise passport (Passport middleware)
app.use(passport.initialize());
app.use(passport.session());

//save the user's ID to the session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

//get its data back by searching all users by ID
passport.deserializeUser((id, done) => {
  const users = User.getUsers();
  const matchingUser = users.find(user => user.id === id);
  done(null, matchingUser);
});

// //login, signup
// app.get("/login", function(req, res) {
//   res.send("Login");
// });
// app.get("/signup", function(req, res) {
//   res.send("Signup");
// });

// app.post('/login',
//   passport.authenticate('local'),
//   function(req, res) {
//     // If this function gets called, authentication was successful.
//     // `req.user` contains the authenticated user.
//     res.redirect('/' + req.user.username);
//   });

app.post("/login", passport.authenticate("local"), function(req, res) {
  // If this function gets called, authentication was successful.
  // `req.user` contains the authenticated user.
  res.redirect("/users/" + req.user.username);
});

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

//buildcontext - so can access in resolvers (i think
//buildcontext will add all additional fields you pass to it to the context.)
const server = new ApolloServer({
  schema,
  context: ({ req, res }) => ({ req, res, User }),
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
