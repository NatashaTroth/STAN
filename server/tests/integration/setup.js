// import { createTestClient } from "apollo-server-testing";
import { typeDefs } from "../../typedefs";
import { resolvers } from "../../resolvers";
import { ApolloServer } from "apollo-server-express"; //UserInputError
import { MongoMemoryServer } from "mongodb-memory-server";
import { User } from "../../models";
import bcrypt from "bcrypt";

import mongoose from "mongoose";

let mongod;

export async function setupApolloServer({ isAuth, userId, user }) {
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

        userInfo: { isAuth, userId, user }
      })
    });
  } catch (err) {
    throw new Error("Apollo server not connected.");
  }
  return server;
}

export async function setupDb() {
  try {
    mongod = new MongoMemoryServer();
    const uri = await mongod.getConnectionString();
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    });
    // console.log("connected to db");
  } catch (err) {
    throw new Error("DB not connected.");
  }
}

/** 
      {
        googleId: '',
        mascot: 1,
        tokenVersion: 0,
        googleLogin: false,
        createdAt: 2020-04-07T13:39:55.593Z,
        _id: 5e8c82acb053b0c3482a8886,
        username: 'Samantha',
        email: 'samantha@stan.com',
        password: '$2b$10$zxgEwVDhvnkNc2nQsmjhjOGQXb9bRXfVOm/qAAvjZwRPmCRwBf3u2',
        __v: 0
      }
     */

export async function signUpTestUser() {
  // try {
  const hashedPassword = await bcrypt.hash("samantha", 10);
  const user = await User.create({
    username: "Samantha",
    email: "samantha@stan.com",
    password: hashedPassword,
    mascot: 1,
    googleId: "",
    googleLogin: false
  });

  if (!user) throw new Error("Could not sign up a test user");

  return user;
  // } catch (err) {
  //   throw err;
  // }
}

export async function clearDatabase() {
  const collections = mongoose.connection.collections;

  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
}

export async function teardown() {
  // console.log("IN TEARDOWN");

  await mongoose.connection.dropDatabase();
  // await mongoose.connection.db.dropDatabase();
  //await db.dropDatabase();
  // await db.users.drop();
  await mongoose.connection.close();
  await mongod.stop();
  // await db.close();
}
