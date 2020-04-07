// import { createTestClient } from "apollo-server-testing";
import { typeDefs } from "../../typedefs";
import { resolvers } from "../../resolvers";
import { ApolloServer } from "apollo-server-express";
import { MongoMemoryServer } from "mongodb-memory-server";

import mongoose from "mongoose";

let mongod;

async function setup({ isAuth, userId }) {
  // console.log("IN SETUP");
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

        userInfo: { isAuth, userId }
      })
    });
    mongod = new MongoMemoryServer();
    const uri = await mongod.getUri();
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    });
    // console.log("connected to db");
  } catch (e) {
    throw new Error("db not connected");
  }

  return server;
}

async function teardown() {
  console.log("IN TEARDOWN");
  await mongod.stop();
}

module.exports = {
  setup,
  teardown
};
