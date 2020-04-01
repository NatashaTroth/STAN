// import { createTestClient } from "apollo-server-testing";
import { typeDefs } from "../../typedefs";
import { resolvers } from "../../resolvers";
import { ApolloServer } from "apollo-server-express";

import mongoose from "mongoose";
// import { User } from "../../models";
// import { isAuth } from "../../helpers/is-auth";

async function setup({ isAuth, userId }) {
  let server;
  try {
    // const headers = new Map();
    // header.set("Authorization", "test");
    server = new ApolloServer({
      typeDefs,
      resolvers,
      context: async ({ req, res }) => ({
        req: {},
        res: {
          cookie: (name, value, options) => {
            return { name, value, options };
          }
        },
        // userInfo: await isAuth({ headers })
        userInfo: { isAuth, userId }
      })
    });
    // global.httpServer = server;
    // await global.httpServer.listen();

    const connectionString = "mongodb://localhost/testMMP3";

    await mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    });
    console.log("connected to db");
  } catch (e) {
    //TODO CHANGE TO TEST
    console.log(e.message);
    throw new Error("db not connected");
  }
  console.log("END OF SETUP");
  return server;
}

async function teardown() {
  console.log("IN TEARDOWN");
  await mongoose.connection.db.dropDatabase();
  //await db.dropDatabase();
  // await db.users.drop();
  await mongoose.connection.close();
  await mongoose.connection.db.close();
}

module.exports = {
  setup,
  teardown
};
