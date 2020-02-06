//TODO: Extract middlewares into separate file??
//TODO: change require to import
import "dotenv/config";
import express from "express";
import { typeDefs } from "./typedefs";
import { resolvers } from "./resolvers";
import mongoose from "mongoose";
import cors from "cors";
import { ApolloServer } from "apollo-server-express";
import { makeExecutableSchema } from "apollo-server";
import isAuth from "./middleware/is-auth";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import { User } from "./models/index";
import { createRefreshToken, createAccessToken } from "./auth";
import { sendRefreshToken } from "./sendRefreshToken";

const connectionString = "mongodb://localhost/MMP3";
const app = express();
const PORT = process.env.PORT || 5000;

mongoose
  .connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("connected to db"))
  .catch(e => console.error(e.message));

app.use(cookieParser());
app.use(isAuth);
// app.use(cors); //add origin & credentials
// app.use(
//   cors({
//     origin: "http://localhost:3000",
//     credentials: true
//   })
//

const schema = makeExecutableSchema({
  typeDefs,
  resolvers
});

const corsOptions = {
  // preflightContinue: true,
  origin: ["http://localhost:3000"],
  credentials: true
};
app.use(cors(corsOptions));

//special route for updating access token - for security reasons
app.post("/refresh_token", async (req, res) => {
  //read refresh cookie - validate that it's correct
  //TODO:late change name of refresh_token
  // console.log("refresh token post");
  const token = req.cookies.refresh_token;
  // console.log("server1 ");
  // console.log(JSON.stringify(req.cookies));
  if (!token) {
    return res.send({ ok: false, accessToken: "" });
  }
  let payload = null;
  // console.log("server3");

  try {
    // console.log(process.env.REFRESH_TOKEN_SECRET);
    payload = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
  } catch (err) {
    console.log(err);
    return res.send({ ok: false, accessToken: "" });
  }
  // console.log("server2");

  //token is valid and we can send back an access token
  const user = await User.findOne({ _id: payload.userId });
  if (!user) {
    return res.send({ ok: false, accessToken: "" });
  }

  if (user.tokenVersion !== payload.tokenVersion) {
    return res.send({ ok: false, accessToken: "" });
  }
  //also refresh the refresh token
  sendRefreshToken(res, createRefreshToken(user));
  return res.send({ ok: true, accessToken: createAccessToken(user) });
});

// app.options("*", cors(corsOptions));
const apolloServer = new ApolloServer({
  schema,
  context: ({ req, res }) => ({ req, res }),
  playground: {
    settings: {
      "request.credentials": "same-origin"
    }
  }
  // cors: corsOptions
});
// apolloServer.applyMiddleware({ app });
apolloServer.applyMiddleware({ app, cors: false });

app.listen({ port: PORT }, () =>
  console.log(
    `🚀 Server ready at http://localhost:5000${apolloServer.graphqlPath}`
  )
);
