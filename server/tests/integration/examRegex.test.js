//https://www.apollographql.com/docs/apollo-server/testing/testing/
//https://mongoosejs.com/docs/jest.html
import "dotenv/config";
import { createTestClient } from "apollo-server-testing";
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
// import { createTestClient } from "apollo-server-integration-testing";

describe("Test user resolver regex", () => {
  //TODO: EXTRACT MONGODB CONNECTIONS
  let server;
  beforeAll(async () => {
    server = await setup({ isAuth: true, userId: "testUserId" });
    // console.log(server);
  });

  afterAll(async () => {
    await teardown();
  });

  it("should use regex to filter out wrong add new exam input data", async () => {
    const { query, mutate } = createTestClient(server);

    const currentUserId = "testUserId";

    let resp = await mutate({
      query: ADD_EXAM_MUTATION,
      variables: {
        subject: "Maths",
        examDate: new Date("2020-08-11"),
        startDate: new Date("2020-08-05"),
        numberPages: 5,
        timePerPage: 5,
        startPage: 6,
        notes: "NOTES",
        pdfLink: "klsdjfs",
        completed: false
      }
    });
    expect(resp.data.addExam).toBeTruthy();

    resp = await mutate({
      query: ADD_EXAM_MUTATION,
      variables: {
        subject: "",
        examDate: new Date("2020-09-11"),
        startDate: new Date("2020-08-05"),
        numberPages: 5,
        timePerPage: 5,
        startPage: 6,
        notes: "NOTES",
        pdfLink: "klsdjfs",
        completed: false
      }
    });
    expect(resp.data.addExam).toBeFalsy();
    expect(resp.errors[0].message).toEqual(
      "Subject input has the wrong format"
    );

    resp = await mutate({
      query: ADD_EXAM_MUTATION,
      variables: {
        subject: "Maths",
        examDate: "test",
        startDate: new Date("2020-08-11"),
        numberPages: 5,
        timePerPage: 5,
        startPage: 6,
        notes: "NOTES",
        pdfLink: "klsdjfs",
        completed: false
      }
    });
    expect(resp.data.addExam).toBeFalsy();
    expect(resp.errors[0].message).toEqual(
      "Exam date input has the wrong format"
    );

    // let resp = await mutate({
    //   query: ADD_EXAM_MUTATION,
    //   variables: {
    //     subject: "Maths",
    //     examDate: new Date("2020-08-11"),
    //     startDate: "test",
    //     numberPages: 5,
    //     timePerPage: 5,
    //     startPage: 6,
    //     notes: "NOTES",
    //     pdfLink: "klsdjfs",
    //     completed: false
    //   }
    // });
    // expect(resp.data.addExam).toBeFalsy();
    // expect(resp.errors[0].message).toEqual(
    //   "Study start date input has the wrong format"
    // );

    resp = await mutate({
      query: ADD_EXAM_MUTATION,
      variables: {
        subject: "Maths",
        examDate: new Date("2150-08-11"),
        startDate: "",
        numberPages: 5,
        timePerPage: 5,
        startPage: 6,
        notes: "NOTES",
        pdfLink: "klsdjfs",
        completed: false
      }
    });

    expect(resp.data.addExam).toBeTruthy();

    resp = await mutate({
      query: ADD_EXAM_MUTATION,
      variables: {
        subject: "Maths",
        examDate: new Date("2020-08-11"),
        startDate: new Date("2020-08-05"),
        numberPages: 5,
        timePerPage: null,
        startPage: null,
        notes: "NOTES",
        pdfLink: "klsdjfs",
        completed: false
      }
    });
    expect(resp.data.addExam).toBeTruthy();

    resp = await mutate({
      query: ADD_EXAM_MUTATION,
      variables: {
        subject: "Maths",
        examDate: new Date("2020-08-11"),
        startDate: new Date("2020-08-05"),
        numberPages: 5,
        timePerPage: 5,
        startPage: 6,
        notes: "d".repeat(100000001),
        pdfLink: "klsdjfs",
        completed: false
      }
    });
    expect(resp.data.addExam).toBeFalsy();
    expect(resp.errors[0].message).toEqual("Notes input has the wrong format");
  });
});
