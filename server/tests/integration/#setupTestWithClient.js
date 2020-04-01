// //https://www.apollographql.com/docs/apollo-server/testing/testing/
// //https://mongoosejs.com/docs/jest.html
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

// import { HttpLink } from "apollo-link-http";
// import ApolloClient from "apollo-client";
// import { InMemoryCache } from "apollo-cache-inmemory";
// import fetch from "node-fetch";

// describe("??", () => {
//   //TODO: EXTRACT MONGODB CONNECTIONS
//   let server;
//   beforeAll(async () => {
//     server = await setup();
//   });

//   afterAll(async () => {
//     // await teardown();
//   });

//   it("should insert a doc into collection", async () => {
//     console.log("IN TEST");

//     const cache = new InMemoryCache();
//     const link = new HttpLink({
//       uri: "http://localhost:5000/graphql",
//       fetch
//     });
//     const authLink = setContext((_, { headers }) => {
//       // get the authentication token from local storage if it exists
//       // const token =
//       //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1ZTcyNjZlZjRjZjAyYzM5MTk4MzIzOWMiLCJ0b2tlblZlcnNpb24iOjM5LCJpYXQiOjE1ODUzNDc5MzcsImV4cCI6MTU4NTM0ODgzN30._Hg3x8xc3Hg2D7-1eRteGw5cEPjycGTffS_zGMdoUoo";
//       // return the headers to the context so httpLink can read them
//       return {
//         headers: {
//           ...headers,
//           authorization: token ? `Bearer ${token}` : ""
//         }
//       };
//     });

//     const graphQLClient = new ApolloClient({
//       link: authLink.concat(httpLink),
//       cache
//     });
//     // const { query, mutate } = createTestClient(server);

//     // run query against the server and snapshot the output
//     const resp = await graphQLClient.mutate({
//       mutation: SIGNUP_MUTATION,
//       variables: {
//         username: "Stan",
//         email: "user@stan.com",
//         password: "12345678",
//         mascot: 1
//       }
//     });

//     console.log(resp);
//     // expect(res).toMatchSnapshot();
//     expect(resp).toBeTruthy();
//   });
//   // use the test server to create a query function
//   // const { query } = createTestClient(server);

//   // // run query against the server and snapshot the output
//   // const res = await query({ query: GET_LAUNCH, variables: { id: 1 } });
//   // expect(res).toMatchSnapshot();
// });
