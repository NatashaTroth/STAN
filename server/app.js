//TODO: Extract middlewares into separate file??
import "dotenv/config";
import express from "express";
import { typeDefs } from "./typedefs";
import { resolvers } from "./resolvers";
import mongoose from "mongoose";
import cors from "cors";
import { ApolloServer } from "apollo-server-express";
import { makeExecutableSchema } from "apollo-server";
import { isAuth } from "./helpers/is-auth";
import cookieParser from "cookie-parser";
import { handleRefreshToken } from "./helpers/authenticationTokens";
import path from "path";
import compress from "compression";
import StanScheduler from "./helpers/StanScheduler";
// import { stanImage } from "./stanBackend.svg";
//TODO: CACHING APOLLO
const connectionString = process.env.MONGODB_URI || "mongodb://localhost/MMP3";
const app = express();
const PORT = process.env.PORT || 5000;
app.use(compress());
//TODO: EXTRACT MONGODB CONNECTIONS

mongoose
  .connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })
  .then(() => console.log("connected to db"))
  .catch(e => console.error(e.message));

app.use(cookieParser());

const schema = makeExecutableSchema({
  typeDefs,
  resolvers
});

//TODO - ONLY FOR DEVELOPMENT
let origin = "http://localhost:3000";

const corsOptions = {
  // preflightContinue: true,
  origin: [origin],
  credentials: true
};

app.use(cors(corsOptions));

const stanScheduler = new StanScheduler();

//special route for updating access token - for security reasons
app.post("/refresh_token", async (req, res) => {
  await handleRefreshToken(req, res);
});

//TODO: remove /graphql when deployed
if (process.env.NODE_ENV === "production") {
  //TODO: CHANGE TO /graphql
  app.use("/backend", express.static(__dirname + "/backend"));
  app.get("/backend", (req, res) => {
    res.sendFile(path.resolve(__dirname, "backend", "index.html"));
  });
  app.use(express.static("public"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "public", "index.html"));
  });
} else {
  app.use("/backend", express.static(__dirname + "/backend"));
  app.get("/", (req, res) => {
    res.sendFile(path.resolve(__dirname, "backend", "index.html"));
  });
}

const apolloServer = new ApolloServer({
  schema,
  context: async ({ req, res }) => ({
    req,
    res,
    userInfo: await isAuth(req)
  }),
  playground: {
    settings: {
      "request.credentials": "same-origin"
      // "editor.theme": "light"
    }
  },
  formatError: err => {
    // Don't give the specific errors to the client.
    if (err.message.startsWith("Database Error: ")) {
      return new Error("Internal server error");
    }
    // if (err.originalError instanceof AuthenticationError) {
    //   return new Error('Different authentication error message!');
    // }

    // Otherwise return the original error.  The error can also
    // be manipulated in other ways, so long as it's returned.
    return err;
  }
  // cors: corsOptions
});

apolloServer.applyMiddleware({ app, cors: false });

app.listen({ port: PORT }, () =>
  console.log(
    `🚀 Server ready at http://localhost:5000${apolloServer.graphqlPath}`
  )
);
