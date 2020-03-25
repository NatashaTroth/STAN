//https://www.apollographql.com/docs/apollo-server/testing/testing/
//https://mongoosejs.com/docs/jest.html
import { createTestClient } from "apollo-server-testing";
import { typeDefs } from "../../typedefs";
import { resolvers } from "../../resolvers";
import { ApolloServer } from "apollo-server-express";
const { MongoClient } = require("mongodb");
import mongoose from "mongoose";
import { User } from "../../models";
import { setup, teardown } from "./setup";

describe("??", () => {
  //TODO: EXTRACT MONGODB CONNECTIONS
  let server;
  beforeAll(async () => {
    setup();
  });

  afterAll(async () => {
    teardown();
  });

  it("should insert a doc into collection", async () => {
    const resp = await User.create({
      username: "testUser",
      email: "test@user.at",
      password: "klsjdflk",
      mascot: 0,
      googleId: "",
      googleLogin: false
    });
    // const users = db.collection("users");

    // const conso = { name: "John1" };
    // await users.insertOne(conso);

    // const insertedUser = await users.findOne({ name: "John1" });
    // expect(insertedUser).toEqual(conso);
    expect(resp).toBeTruthy();
  });
  // use the test server to create a query function
  // const { query } = createTestClient(server);

  // // run query against the server and snapshot the output
  // const res = await query({ query: GET_LAUNCH, variables: { id: 1 } });
  // expect(res).toMatchSnapshot();
});
