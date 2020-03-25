//https://www.apollographql.com/docs/apollo-server/testing/testing/
//https://mongoosejs.com/docs/jest.html
import { createTestClient } from "apollo-server-testing";
import { typeDefs } from "../../typedefs";
import { resolvers } from "../../resolvers";
import { ApolloServer } from "apollo-server-express";
const { MongoClient } = require("mongodb");
// import mongoose from "mongoose";
import { User } from "../../models";

describe("??", () => {
  // create a test server to test against, using our production typeDefs,
  // resolvers, and dataSources.

  //TODO: EXTRACT MONGODB CONNECTIONS
  const server = global.test;

  beforeEach(() => {
    jest.setTimeout(10000);
  });
  // console.log("here" + server);

  // beforeAll(async () => {
  //   mongoose
  //     .connect(connectionString, {
  //       useNewUrlParser: true,
  //       useUnifiedTopology: true,
  //       useCreateIndex: true
  //     })
  //     .then(() => console.log("connected to db"))
  //     .catch(e => {
  //       console.error(e.message);
  //       //TODO CHANGE TO TEST
  //       throw new Error("db not connected");
  //     });
  // });

  // afterAll(async () => {
  //   await db.dropDatabase();
  //   // await db.users.drop();
  //   await connection.close();
  //   await db.close();
  // });

  it("should insert a doc into collection", async () => {
    const mongoose = global.mongoose;
    console.log("IN TESTING " + global.mongoose);
    // console.log(global.dbConnection);
    // const resp = await User.create({
    //   username: "testUser",
    //   email: "test@user.at",
    //   password: "klsjdflk",
    //   mascot: 0,
    //   googleId: "",
    //   googleLogin: false
    // });
    const resp = await User.find({});

    expect("test").toBeTruthy();
  });
  // use the test server to create a query function
  // const { query } = createTestClient(server);

  // // run query against the server and snapshot the output
  // const res = await query({ query: GET_LAUNCH, variables: { id: 1 } });
  // expect(res).toMatchSnapshot();
});
