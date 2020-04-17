//https://www.apollographql.com/docs/apollo-server/testing/testing/
//https://mongoosejs.com/docs/jest.html
import "dotenv/config";
import { createTestClient } from "apollo-server-testing";
import {
  setupApolloServer,
  setupDb,
  signUpTestUser,
  clearDatabase,
  teardown
} from "../setup";
import { UPDATE_USER_MUTATION } from "../../mutations.js";

import { User } from "../../../models";
import bcrypt from "bcrypt";

describe("Test user sign up and login resolvers", () => {
  let server;
  let mutate;

  let testUser;
  let client;

  beforeAll(async () => {
    await setupDb();
  });
  beforeEach(async () => {
    testUser = await signUpTestUser();
    server = await setupApolloServer({
      isAuth: true,
      userId: testUser._id,
      user: testUser
    });

    client = createTestClient(server);
    mutate = client.mutate;
  });

  afterEach(async () => {
    await clearDatabase();
  });

  afterAll(async () => {
    await clearDatabase();
    await teardown();
  });

  /** TESTUSER:
      {
        googleId: '',
        mascot: 1,
        accessTokenVersion: 0,
        refreshTokenVersion: 0,
        googleLogin: false,
        createdAt: 2020-04-07T13:39:55.593Z,
        _id: 5e8c82acb053b0c3482a8886,
        username: 'Samantha',
        email: 'samantha@stan.com',
        password: '$2b$10$zxgEwVDhvnkNc2nQsmjhjOGQXb9bRXfVOm/qAAvjZwRPmCRwBf3u2',
        __v: 0
      }
     */

  it("should update the current user", async () => {
    const resp = await mutate({
      query: UPDATE_USER_MUTATION,
      variables: {
        username: "Samantha's new username",
        email: "newSamantha@node.com",
        password: "samantha",
        newPassword: "12345678",
        mascot: 2
      }
    });

    expect(resp.data.updateUser).toBeTruthy();

    expect(resp.data.updateUser).toMatchObject({
      username: "Samantha's new username",
      email: "newSamantha@node.com",
      mascot: 2
    });

    const user = await User.findOne({
      _id: testUser._id
    });
    expect(user).toBeTruthy();
    expect(await bcrypt.compare("12345678", user.password)).toBeTruthy();
    expect(user).toMatchObject({
      username: "Samantha's new username",
      email: "newSamantha@node.com",
      mascot: 2
    });
  });

  it("should update the current user password", async () => {
    //only update password
    const resp = await mutate({
      query: UPDATE_USER_MUTATION,
      variables: {
        username: testUser.username,
        email: testUser.email,
        password: "samantha",
        newPassword: "12345678",
        mascot: testUser.mascot
      }
    });
    expect(resp.data.updateUser).toBeTruthy();
    const user = await User.findOne({
      _id: testUser._id
    });
    expect(await bcrypt.compare("12345678", user.password)).toBeTruthy();
  });

  it("should update the current user, but not the password", async () => {
    const resp = await mutate({
      query: UPDATE_USER_MUTATION,
      variables: {
        username: testUser.username,
        email: testUser.email,
        password: "samantha",

        mascot: testUser.mascot
      }
    });
    expect(resp.data.updateUser).toBeTruthy();
    expect(resp.data.updateUser).toMatchObject({
      username: "Samantha",
      email: "samantha@stan.com",
      mascot: 1
    });
  });

  it("should not update the current user, since the password is incorrect", async () => {
    const resp = await mutate({
      query: UPDATE_USER_MUTATION,
      variables: {
        username: "Samantha's new username",
        email: "newSamantha@node.com",
        password: "wrong password",
        mascot: 2
      }
    });

    expect(resp.data).toBeFalsy();
    expect(resp.errors[0].message).toEqual("Password is incorrect.");
  });

  it("should only update certain fields since the user logged in with a google account", async () => {
    const resp = await mutate({
      query: UPDATE_USER_MUTATION,
      variables: {
        username: "Samantha's new username",
        email: "newSamantha@node.com",
        password: "wrong password",
        mascot: 2
      }
    });

    expect(resp.data).toBeFalsy();
    expect(resp.errors[0].message).toEqual("Password is incorrect.");
  });
});