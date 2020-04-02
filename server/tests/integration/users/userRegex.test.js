//https://www.apollographql.com/docs/apollo-server/testing/testing/
//https://mongoosejs.com/docs/jest.html
import "dotenv/config";
import { createTestClient } from "apollo-server-testing";

import { typeDefs } from "../../../typedefs";
import { resolvers } from "../../../resolvers";
import { ApolloServer } from "apollo-server-express";
const { MongoClient } = require("mongodb");
import mongoose from "mongoose";
import { User } from "../../../models";

import { setup, teardown } from "../setup";
import {
  ADD_EXAM_MUTATION,
  LOGIN_MUTATION,
  LOGOUT_MUTATION,
  SIGNUP_MUTATION,
  GOOGLE_LOGIN_MUTATION
} from "../../mutations.js";
import { GET_EXAMS_QUERY, CURRENT_USER } from "../../queries.js";

// import { createTestClient } from "apollo-server-integration-testing";

describe("Test user resolver regex", () => {
  //TODO: EXTRACT MONGODB CONNECTIONS
  let server;
  beforeAll(async () => {
    server = await setup({ isAuth: false });
  });

  afterAll(async () => {
    await teardown();
  });

  it("should use regex to filter out wrong sign up input data", async () => {
    const { mutate } = createTestClient(server);
    let resp;
    resp = await mutate({
      query: SIGNUP_MUTATION,
      variables: {
        username: "Stan",
        email: "user@stan.com",
        password: "12345678",
        mascot: 1
      }
    });
    expect(resp.data.signup).toBeTruthy();

    resp = await mutate({
      query: SIGNUP_MUTATION,
      variables: {
        username: "Stan",
        email: "userstan.com",
        password: "12345678",
        mascot: 1
      }
    });
    expect(resp.data.signup).toBeFalsy();
    expect(resp.errors[0].message).toEqual("Email input has the wrong format");

    resp = await mutate({
      query: SIGNUP_MUTATION,
      variables: {
        username: "",
        email: "user2@stan.com",
        password: "12345678",
        mascot: 1
      }
    });
    expect(resp.data.signup).toBeFalsy();
    expect(resp.errors[0].message).toEqual(
      "Username input has the wrong format"
    );

    resp = await mutate({
      query: SIGNUP_MUTATION,
      variables: {
        username: "Stan",
        email: "user3@stan.com",
        password: "",
        mascot: 1
      }
    });
    expect(resp.data.signup).toBeFalsy();
    expect(resp.errors[0].message).toEqual(
      "Password input has the wrong format"
    );

    resp = await mutate({
      query: SIGNUP_MUTATION,
      variables: {
        username: "Stan",
        email: "",
        password: "12345678",
        mascot: 1
      }
    });
    expect(resp.data.signup).toBeFalsy();
    expect(resp.errors[0].message).toEqual("Email input has the wrong format");

    resp = await mutate({
      query: SIGNUP_MUTATION,
      variables: {
        username: "Stan",
        email: "A@b@c@stan.com",
        password: "12345678",
        mascot: 1
      }
    });
    expect(resp.data.signup).toBeFalsy();
    expect(resp.errors[0].message).toEqual("Email input has the wrong format");
  });

  it("should use regex to filter out wrong login input data", async () => {
    const { mutate } = createTestClient(server);
    let resp;
    resp = await mutate({
      query: LOGIN_MUTATION,
      variables: {
        email: "user@stan.com",
        password: "12345678"
      }
    });
    expect(resp.data.login).toBeTruthy();

    resp = await mutate({
      query: LOGIN_MUTATION,
      variables: {
        email: "userstan.com",
        password: "12345678"
      }
    });
    expect(resp.data.login).toBeFalsy();
    expect(resp.errors[0].message).toEqual("Email input has the wrong format");

    resp = await mutate({
      query: LOGIN_MUTATION,
      variables: {
        email: "user@stan.com",
        password: "1234567"
      }
    });
    expect(resp.data.login).toBeFalsy();
    expect(resp.errors[0].message).toEqual(
      "Password input has the wrong format"
    );

    resp = await mutate({
      query: LOGIN_MUTATION,
      variables: {
        email: "",
        password: "12345678"
      }
    });
    expect(resp.data.login).toBeFalsy();
    expect(resp.errors[0].message).toEqual("Email input has the wrong format");

    resp = await mutate({
      query: LOGIN_MUTATION,
      variables: {
        email: "user@stan.com",
        password: ""
      }
    });
    expect(resp.data.login).toBeFalsy();
    expect(resp.errors[0].message).toEqual(
      "Password input has the wrong format"
    );
  });
});
