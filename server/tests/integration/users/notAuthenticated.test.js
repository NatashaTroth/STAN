//https://www.apollographql.com/docs/apollo-server/testing/testing/
//https://mongoosejs.com/docs/jest.html
import "dotenv/config";
import { createTestClient } from "apollo-server-testing";
import { setupApolloServer, setupDb, teardown } from "../setup";

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
  beforeAll(async () => {
    await setupDb();
    server = await setupApolloServer({ isAuth: false });
    let client = createTestClient(server);
    mutate = client.mutate;
    query = client.query;
  });

  afterAll(async () => {
    await teardown();
  });

  it("should sign up a user", async () => {
    const initialCount = await User.countDocuments();
    const resp = await mutate({
      query: SIGNUP_MUTATION,
      variables: {
        username: "Stan",
        email: "user@stan.com",
        password: "12345678",
        mascot: 1
      }
    });
    expect(resp.data.signup).toBeTruthy();

    const newCount = await User.countDocuments();
    expect(newCount).toBe(initialCount + 1);

    const user = await User.findOne({
      username: "Stan",
      email: "user@stan.com"
    });
    expect(user).toBeTruthy();
    expect(user.id).toBe(resp.data.signup.user.id);
    expect(user.username).toBe(resp.data.signup.user.username);
    expect(user.email).toBe(resp.data.signup.user.email);
    expect(user.mascot).toBe(resp.data.signup.user.mascot);
    expect(user.googleId).toBe(resp.data.signup.user.googleId);
    expect(user.googleLogin).toBe(resp.data.signup.user.googleLogin);

    //Test accesstoken
    expect(resp.data.signup.accessToken).toBeDefined();
    const decodedToken = jwt.verify(
      resp.data.signup.accessToken,
      process.env.ACCESS_TOKEN_SECRET
    );
    expect(decodedToken).toBeTruthy();
    expect(decodedToken.userId).toBe(user.id);
    expect(decodedToken.tokenVersion).toBe(0);
    //TEST ISAUTH ?
  });

  it("should not sign the user up again with the same email address", async () => {
    await signUserUp("Stan2", "user2@stan.com", "12345678");
    const resp = await mutate({
      query: SIGNUP_MUTATION,
      variables: {
        username: "Stan",
        email: "user2@stan.com",
        password: "12345678",
        mascot: 1
      }
    });
    expect(resp.data.signup).toBeFalsy();
    expect(resp.errors[0].message).toEqual("User with email already exists.");
  });

  it("should not update the mascot for a user", async () => {
    const resp = await mutate({
      query: UPDATE_MASCOT_MUTATION,
      variables: {
        mascot: 2
      }
    });
    expect(resp.data.updateMascot).toBeFalsy();
    expect(resp.errors[0].message).toEqual("Unauthorised");

    const resp2 = await mutate({
      query: UPDATE_MASCOT_MUTATION,
      variables: {
        mascot: 5
      }
    });
    expect(resp2.data.updateMascot).toBeFalsy();
    expect(resp2.errors[0].message).toEqual("Unauthorised");
  });

  //_----------------------------------LOGIN----------------------------------
  it("should login an existing user", async () => {
    await signUserUp("Stan3", "user3@stan.com", "12345678");

    const initialCount = await User.countDocuments();
    const resp = await mutate({
      query: LOGIN_MUTATION,
      variables: {
        email: "user3@stan.com",
        password: "12345678"
      }
    });
    expect(resp.data.login).toBeTruthy();

    const newCount = await User.countDocuments();
    expect(newCount).toBe(initialCount);

    //Test accesstoken
    expect(resp.data.login.accessToken).toBeDefined();
    const decodedToken = jwt.verify(
      resp.data.login.accessToken,
      process.env.ACCESS_TOKEN_SECRET
    );
    expect(decodedToken).toBeTruthy();
    expect(decodedToken.userId).toBe(resp.data.login.user.id);
    expect(decodedToken.tokenVersion).toBe(0);
  });

  it("should not login a non existing user", async () => {
    const resp = await mutate({
      query: LOGIN_MUTATION,
      variables: {
        email: "notAUser@stan.com",
        password: "12345678"
      }
    });
    expect(resp.data.login).toBeFalsy();
    expect(resp.errors[0].message).toEqual(
      "User with this email does not exist."
    );
  });

  it("should fetch the current user - which is null", async () => {
    const resp = await query({
      query: CURRENT_USER
    });
    expect(resp.data.currentUser).toBeFalsy();
    expect(resp.data.currentUser).toBe(null);
  });

  //TODO: TEST GOOGLE LOGIN
  //TODO: TEST TOKEN VERSION

  async function signUserUp(username, email, password, mascot) {
    const initialCount = await User.countDocuments();
    const resp = await mutate({
      query: SIGNUP_MUTATION,
      variables: {
        username,
        email,
        password,
        mascot: mascot || 0
      }
    });
    expect(resp.data.signup).toBeTruthy();
    const newCount = await User.countDocuments();
    expect(newCount).toBe(initialCount + 1);
    return resp;
  }

  it("should not log the user out - user isn't logged in", async () => {
    //Already logged in
    const resp = await mutate({
      query: LOGOUT_MUTATION
    });

    expect(resp.data.logout).toBeFalsy();
    expect(resp.errors[0].message).toEqual("Unauthorised");
  });
});

//todo: not logout...
