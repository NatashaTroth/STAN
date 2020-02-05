//TODO: Extract middlewares into separate file??
//TODO: change require to import
import "dotenv/config";
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
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import { User } from "./models/index";
import { createRefreshToken, createAccessToken } from "./auth";
import { sendRefreshToken } from "./sendRefreshToken";

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

app.use(cookieParser());
app.use(isAuth);

//special route for updating access token - for security reasons
app.post("/refresh_token", async (req, res) => {
  //read refresh cookie - validate that it's correct
  //TODO:late change name of refresh_token
  const token = req.cookies.refresh_token;
  if (!token) {
    return res.send({ ok: false, accessToken: "" });
  }
  let payload = null;
  try {
    // console.log(process.env.REFRESH_TOKEN_SECRET);
    payload = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
  } catch (err) {
    console.log(err);
    return res.send({ ok: false, accessToken: "" });
  }

  //token is valid and we can send back an access token
  const user = await User.findOne({ _id: payload.userId });
  if (!user) {
    return res.send({ ok: false, accessToken: "" });
  }
  console.log("token version");
  console.log(user.tokenVersion); //from db
  console.log(payload.tokenVersion); //from cookie
  if (user.tokenVersion !== payload.tokenVersion) {
    return res.send({ ok: false, accessToken: "" });
  }
  //also refresh the refresh token
  sendRefreshToken(res, createRefreshToken(user));
  return res.send({ ok: true, accessToken: createAccessToken(user) });
});

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
