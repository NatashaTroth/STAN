// //https://www.apollographql.com/docs/apollo-server/testing/testing/
// //https://mongoosejs.com/docs/jest.html
// import "dotenv/config";
// import { createTestClient } from "apollo-server-testing";
// import { typeDefs } from "../../../typedefs";
// import { resolvers } from "../../../resolvers";
// import { ApolloServer } from "apollo-server-express";
// const { MongoClient } = require("mongodb");
// import mongoose from "mongoose";
// import { User } from "../../../models";

// import { setup, teardown } from "../setup";
// import { ADD_EXAM_MUTATION } from "../../mutations.js";
// import { GET_TODAYS_CHUNKS } from "../../queries.js";
// // import { createTestClient } from "apollo-server-integration-testing";

// describe("Tests exam resolver todaysChunks", () => {
//   let server;
//   beforeAll(async () => {
//     server = await setup({ isAuth: true, userId: "testUserId" });
//   });

//   afterAll(async () => {
//     await teardown();
//   });

//   // it("should use return today's Chunks to the users", async () => {
//   it("should successfully add exams", async () => {
//     const { query, mutate } = createTestClient(server);

//     const currentUserId = "testUserId";
//     console.log("DATE:");
//     let endDay = new Date();
//     endDay.setDate(endDay.getDate() + 6);
//     // console.log(nextDay);
//     // console.log(formatDateyyyymmdd(new Date()));
//     let resp = await mutate({
//       query: ADD_EXAM_MUTATION,
//       variables: {
//         subject: "German",
//         examDate: formatDateyyyymmdd(new Date()),
//         startDate: formatDateyyyymmdd(endDay),
//         numberPages: 50,
//         timePerPage: 5,
//         startPage: 6,
//         notes: "NOTES",
//         pdfLink: "klsdjfs",
//         completed: false
//       }
//     });
//     console.log(resp);
//     expect(resp.data.addExam).toBeTruthy();

//     // resp = await mutate({
//     //   query: ADD_EXAM_MUTATION,
//     //   variables: {
//     //     subject: "Maths",
//     //     examDate: new Date(new Date() + 9).toLocaleDateString(),
//     //     startDate: new Date().toLocaleDateString(),
//     //     numberPages: 600,
//     //     timePerPage: null,
//     //     startPage: null,
//     //     notes: "NOTES",
//     //     pdfLink: "klsdjfs",
//     //     completed: false
//     //   }
//     // });

//     // expect(resp.data.addExam).toBeTruthy();

//     // resp = await query({
//     //   query: GET_TODAYS_CHUNKS
//     // });

//     // expect(resp.data.todaysChunks).toBeTruthy();
//     // console.log(resp.data.todaysChunks);

//     // expect(resp.data.todaysChunks).toEqual(
//     //   expect.objectContaining({
//     //     todaysChunks: [
//     //       {
//     //         // "examId": expect.,
//     //         subject: "Maths",
//     //         numberPages: 60,
//     //         duration: null
//     //       },
//     //       {
//     //         // "examId": "5e84c93ab4ac3d09e943be90",
//     //         subject: "German",
//     //         numberPages: 8,
//     //         duration: 40
//     //       }
//     //     ]
//     //   })
//     // );
//   });
// });

// //modified from source: https://stackoverflow.com/a/3067896

// function formatDateyyyymmdd(date) {
//   // console.log(date);
//   var mm = date.getMonth() + 1; // getMonth() is zero-based
//   var dd = date.getDate();

//   return [
//     date.getFullYear(),
//     (mm > 9 ? "" : "0") + mm,
//     (dd > 9 ? "" : "0") + dd
//   ].join(".");
// }
