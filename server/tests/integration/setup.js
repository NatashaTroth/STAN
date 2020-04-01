// import { createTestClient } from "apollo-server-testing";
import { typeDefs } from "../../typedefs";
import { resolvers } from "../../resolvers";
import { ApolloServer } from "apollo-server-express";
import { MongoMemoryServer } from "mongodb-memory-server";

import mongoose from "mongoose";
// import { User } from "../../models";
// import { isAuth } from "../../helpers/is-auth";

let mongod;

async function setup({ isAuth, userId }) {
  console.log("IN SETUP");
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

    // const connectionString = "mongodb://localhost/testMMP3";
    // const connectionString = "mongodb://localhost/testMMP3";
    mongod = new MongoMemoryServer();
    const uri = await mongod.getUri();
    // const port = await mongod.getPort();
    // const dbPath = await mongod.getDbPath();
    // const dbName = await mongod.getDbName();
    await mongoose.connect(uri, {
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
  await mongod.stop();
  // await mongoose.connection.db.dropDatabase();
  // //await db.dropDatabase();
  // // await db.users.drop();
  // await mongoose.connection.close();
  // await mongoose.connection.db.close();
}

module.exports = {
  setup,
  teardown
};
