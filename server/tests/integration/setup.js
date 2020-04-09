// import { createTestClient } from "apollo-server-testing";
import { typeDefs } from "../../typedefs";
import { resolvers } from "../../resolvers";
import { ApolloServer } from "apollo-server-express"; //UserInputError
import { MongoMemoryServer } from "mongodb-memory-server";
import { User, Exam } from "../../models";
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
}

// export async function addTestExam() {
//   const exam = await Exam.create({
//     subject: "Samantha's Exam",
//     examDate: "2522-04-11",
//     startDate: "2522-04-05",
//     numberPages: 50,
//     timePerPage: 5,
//     startPage: 1,
//     currentPage: 1,
//     timesRepeat: 2,
//     notes: "Samantha's notes",
//     pdfLink: "samanthas-link.stan",
//     completed: false,
//     userId: "samanthasId"
//   });

//   if (!exam) throw new Error("Could not add a test exam");

//   return exam;
// }

export async function clearDatabase() {
  const collections = mongoose.connection.collections;

  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
  await mongoose.connection.dropDatabase();
  if (global.gc) global.gc();
}

export async function teardown() {
  // console.log("IN TEARDOWN");
  // await mongoose.connection.db.dropDatabase();
  //await db.dropDatabase();
  // await db.users.drop();
  // await db.close();

  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongod.stop();
  // mongoose = "";
  // mongod = "";
  global.gc();
}
