//https://www.apollographql.com/docs/apollo-server/testing/testing/
//https://mongoosejs.com/docs/jest.html
// import { createTestClient } from "apollo-server-testing";
import { typeDefs } from "../../typedefs";
import { resolvers } from "../../resolvers";
import { ApolloServer } from "apollo-server-express";
const { MongoClient } = require("mongodb");
import mongoose from "mongoose";
import { User } from "../../models";
import { setup, teardown } from "./setup";
import {
  ADD_EXAM_MUTATION,
  LOGIN_MUTATION,
  LOGOUT_MUTATION,
  SIGNUP_MUTATION,
  GOOGLE_LOGIN_MUTATION
} from "../mutations.js";
import { GET_EXAMS_QUERY, CURRENT_USER } from "../queries.js";
import { createTestClient } from "apollo-server-integration-testing";

describe("??", () => {
  //TODO: EXTRACT MONGODB CONNECTIONS
  let server;
  beforeAll(async () => {
    server = await setup();
  });

  afterAll(async () => {
    // await teardown();
  });

  it("should insert a doc into collection", async () => {
    console.log("IN TEST");
    // const resp = await User.create({
    //   username: "testUser",
    //   email: "test@user.at",
    //   password: "klsjdflk",
    //   mascot: 0,
    //   googleId: "",
    //   googleLogin: false
    // });
    // const users = db.collection("users");

    // const conso = { name: "John1" };
    // await users.insertOne(conso);

    // const insertedUser = await users.findOne({ name: "John1" });
    // expect(insertedUser).toEqual(conso);

    //  use the test server to create a query function
    // const { query, mutate } = createTestClient({ server });
    const { query } = createTestClient({
      apolloServer,
      extendMockRequest: {
        headers: {
          cookie: "csrf=blablabla",
          referer: ""
        }
      },
      extendMockResponse: {
        locals: {
          user: {
            isAuthenticated: false
          }
        }
      }
    });

    // run query against the server and snapshot the output
    const resp = await mutate({
      query: SIGNUP_MUTATION,
      variables: {
        username: "Stan",
        email: "user@stan.com",
        password: "12345678",
        mascot: 1
      }
    });
    console.log(resp);
    // expect(res).toMatchSnapshot();
    expect(resp).toBeTruthy();
  });
  // use the test server to create a query function
  // const { query } = createTestClient(server);

  // // run query against the server and snapshot the output
  // const res = await query({ query: GET_LAUNCH, variables: { id: 1 } });
  // expect(res).toMatchSnapshot();
});
