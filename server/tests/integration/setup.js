import { createTestClient } from "apollo-server-testing";
import { typeDefs } from "../../typedefs";
import { resolvers } from "../../resolvers";
import { ApolloServer } from "apollo-server-express";
const { MongoClient } = require("mongodb");
import mongoose from "mongoose";
import { User } from "../../models";
import { isAuth } from "../../helpers/is-auth";

// class testSetup {
// constructor() {
//   // Constructor
//   // this.carname = brand;
// }

async function setup() {
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
        userInfo: true
      })
    });
    // global.httpServer = server;
    // await global.httpServer.listen();

    const connectionString = "mongodb://localhost/testMMP3";
    let connection;
    let db;

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
  await connection.close();
  await db.close();
}

module.exports = {
  setup,
  teardown
};
