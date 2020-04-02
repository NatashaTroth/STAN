// //https://www.apollographql.com/docs/apollo-server/testing/testing/
// //https://mongoosejs.com/docs/jest.html
// import "dotenv/config";
// import { createTestClient } from "apollo-server-testing";
// import { typeDefs } from "../../typedefs";
// import { resolvers } from "../../resolvers";
// import { ApolloServer } from "apollo-server-express";
// const { MongoClient } = require("mongodb");
// import mongoose from "mongoose";
// import { User } from "../../models";

// import { setup, teardown } from "./setup";
// import {
//   ADD_EXAM_MUTATION,
//   LOGIN_MUTATION,
//   LOGOUT_MUTATION,
//   SIGNUP_MUTATION,
//   GOOGLE_LOGIN_MUTATION
// } from "../mutations.js";
// import { GET_EXAMS_QUERY, CURRENT_USER } from "../queries.js";
// // import { createTestClient } from "apollo-server-integration-testing";

// describe("Test user resolver regex", () => {
//   //TODO: EXTRACT MONGODB CONNECTIONS
//   let server;
//   beforeAll(async () => {
//     server = await setup();
//   });

//   afterAll(async () => {
//     await teardown();
//   });

//   it("should use regex to filter out wrong sign up input data", async () => {
//     const { query, mutate } = createTestClient(server);
//     let resp;
//     resp = await mutate({
//       query: SIGNUP_MUTATION,
//       variables: {
//         username: "Stan",
//         email: "user@stan.com",
//         password: "12345678",
//         mascot: 1
//       }
//     });
//     expect(resp.data.signup).toBeTruthy();
//   });

//   //toBe() versus toEqual() : toEqual() checks equivalence. toBe() , on the other hand, makes sure that they're the exact same object.
//   // use the test server to create a query function
//   // const { query } = createTestClient(server);

//   // // run query against the server and snapshot the output
//   // const res = await query({ query: GET_LAUNCH, variables: { id: 1 } });
//   // expect(res).toMatchSnapshot();
// });
