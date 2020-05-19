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
import depthLimit from "graphql-depth-limit";
import { createComplexityLimitRule } from "graphql-validation-complexity";
import timeout from "connect-timeout";
import sslRedirect from "heroku-ssl-redirect";

// import { stanImage } from "./stanBackend.svg";
//TODO: CACHING APOLLO
const connectionString = process.env.MONGODB_URI || "mongodb://localhost/MMP3";
const app = express();
const PORT = process.env.PORT || 5000;
app.use(timeout("5s"));
app.use(compress());
//TODO: EXTRACT MONGODB CONNECTIONS

mongoose
  .connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
    // autoIndex: false
  })

  .then(db => {
    console.log("connected to db ");
    // console.log(db.modelSchemas.User._indexes);
  })
  .catch(e => console.error(e.message));

app.use(cookieParser());

const schema = makeExecutableSchema({
  typeDefs,
  resolvers
});

//TODO - ONLY FOR DEVELOPMENT
let origin = "http://localhost:3000";
const corsOptions = {
  origin: [origin],
  credentials: true
};

app.use(cors(corsOptions));

// app.use(
//   "/graphql",
//   graphqlServer((req, res) => {
//     const query = req.query.query || req.body.query;
//     // TODO: Get whitelist somehow
//     if (!whitelist[query]) {
//       throw new Error("Query is not in whitelist.");
//     }
//     /* ... */
//   })
// );

new StanScheduler();

const apolloServer = new ApolloServer({
  schema,

  context: async ({ req, res }) => ({
    req,
    res,
    userInfo: await isAuth(req)
    // introspection: true, //TODO DELETE
    // playground: true //TODO DELETE
  }),
  engine: {
    apiKey: process.env.ENGINE_API_KEY_VAR,
    schemaTag: process.env.NODE_ENV
  },
  cacheControl: {
    defaultMaxAge: 20
  },
  // engine: {
  //   // The Graph Manager API key
  //   apiKey: process.env.ENGINE_API_KEY
  //   // A tag for this specific environment (e.g. `development` or `production`).
  //   // For more information on schema tags/variants, see
  //   // https://www.apollographql.com/docs/platform/schema-registry/#associating-metrics-with-a-variant
  //   // schemaTag: "development"
  // },
  playground: {
    settings: {
      "request.credentials": "same-origin"
      // "editor.theme": "light"
    }
  },
  validationRules: [depthLimit(5), createComplexityLimitRule(1000)]
  // formatError: err => {
  //   // Don't give the specific errors to the client.
  //   if (err.message.startsWith("Database Error: ")) {
  //     return new Error("Internal server error");
  //   }
  //   // if (err.originalError instanceof AuthenticationError) {
  //   //   return new Error('Different authentication error message!');
  //   // }

  //   // Otherwise return the original error.  The error can also
  //   // be manipulated in other ways, so long as it's returned.
  //   return err;
  // }
  // cors: corsOptions
});

//special route for updating access token - for security reasons
app.post("/refresh_token", async (req, res) => {
  await handleRefreshToken(req, res);
});

// TODO: remove /graphql when deployed
if (process.env.NODE_ENV === "production") {
  app.use(sslRedirect());
  //think it might have looped insecure
  // app.use(function(req, res, next) {
  //   if (req.secure) {
  //     console.log("secure");

  //     // request was via https, so do no special handling
  //     next();
  //   } else {
  //     console.log("insecure");
  //     // request was via http, so redirect to https
  //     res.redirect("https://" + req.headers.host + req.url);
  //   }
  // });
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

apolloServer.applyMiddleware({ app, cors: false });

app.listen({ port: PORT }, () =>
  console.log(
    `🚀 Server ready at http://localhost:5000${apolloServer.graphqlPath}`
  )
);
