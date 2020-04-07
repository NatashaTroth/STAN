//https://www.apollographql.com/docs/apollo-server/testing/testing/
//https://mongoosejs.com/docs/jest.html
import "dotenv/config";
import { createTestClient } from "apollo-server-testing";
import { setupApolloServer, setupDb, signUpTestUser, teardown } from "../setup";
import {
  LOGIN_MUTATION,
  SIGNUP_MUTATION,
  UPDATE_MASCOT_MUTATION,
  LOGOUT_MUTATION
} from "../../mutations.js";
import { CURRENT_USER } from "../../queries.js";
import { User } from "../../../models";
import { isAuth } from "../../../helpers/is-auth";
import jwt from "jsonwebtoken";

// import { createTestClient } from "apollo-server-integration-testing";

describe("Test user sign up and login resolvers", () => {
  let server;
  let mutate;
  let query;
  let testUser;
  let client;
  beforeAll(async () => {
    await setupDb();
    testUser = await signUpTestUser();
    server = await setupApolloServer({
      isAuth: true,
      userId: testUser._id,
      user: testUser
    });
    client = createTestClient(server);
    mutate = client.mutate;
    query = client.mutate;
  });

  afterAll(async () => {
    await teardown();
  });

  /** TESTUSER:
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

  it("should fetch the current logged in user", async () => {
    const resp = await query({
      query: CURRENT_USER
    });
    expect(resp.data.currentUser).toBeTruthy();
    expect(resp.data.currentUser.id.toString()).toBe(testUser._id.toString());
    expect(resp.data.currentUser.username).toBe(testUser.username);
    expect(resp.data.currentUser.email).toBe(testUser.email);
    expect(resp.data.currentUser.mascot).toBe(testUser.mascot);
    expect(resp.data.currentUser.googleLogin).toBe(testUser.googleLogin);
  });

  it("should update the mascot for a user", async () => {
    const resp = await mutate({
      query: UPDATE_MASCOT_MUTATION,
      variables: {
        mascot: 2
      }
    });
    expect(resp.data.updateMascot).toBeTruthy();

    const user = await User.findOne({
      username: testUser.username,
      email: testUser.email
    });
    expect(user).toBeTruthy();
    expect(user.mascot).toBe(2);

    const resp2 = await mutate({
      query: UPDATE_MASCOT_MUTATION,
      variables: {
        mascot: 5
      }
    });
    expect(resp2.data.updateMascot).toBeFalsy();
    expect(resp2.errors[0].message).toEqual(
      "Mascot input has the wrong format. It must be one of the following numbers: 0, 1, 2."
    );
  });

  it("should not sign up or login a user if already logged in", async () => {
    //Already logged in
    const resp = await mutate({
      query: SIGNUP_MUTATION,
      variables: {
        username: "Stan",
        email: "user@stan.com",
        password: "12345678",
        mascot: 1
      }
    });
    expect(resp.data.updateMascot).toBeFalsy();
    expect(resp.errors[0].message).toEqual("Already logged in.");

    //Already logged in
    const resp2 = await mutate({
      query: LOGIN_MUTATION,
      variables: {
        email: "samantha@stan.com",
        password: "samantha"
      }
    });
    expect(resp2.data.updateMascot).toBeFalsy();
    expect(resp2.errors[0].message).toEqual("Already logged in.");
  });

  it("should log the user out", async () => {
    //Already logged in
    const resp = await mutate({
      query: LOGOUT_MUTATION
    });
    console.log(resp);
    expect(resp.data.logout).toBeTruthy();
  });
  //TEST ISAUTH ?
  //TODO: TEST TOKEN VERSION
});
