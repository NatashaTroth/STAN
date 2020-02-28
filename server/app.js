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
import { handleRefreshToken } from "./refreshToken";
//TODO: CACHING APOLLO
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
  await handleRefreshToken(req, res);
});

// app.options("*", cors(corsOptions));
const apolloServer = new ApolloServer({
  schema,
  context: ({ req, res }) => ({ req, res }),
  playground: {
    settings: {
      "request.credentials": "same-origin"
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
// apolloServer.applyMiddleware({ app });
apolloServer.applyMiddleware({ app, cors: false });

app.listen({ port: PORT }, () =>
  console.log(
    `🚀 Server ready at http://localhost:5000${apolloServer.graphqlPath}`
  )
);
