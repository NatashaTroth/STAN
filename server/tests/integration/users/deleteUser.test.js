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
import { DELETE_USER_MUTATION } from "../../mutations.js";

import { CURRENT_USER } from "../../queries.js";
import { User } from "../../../models";
import { createAccessToken } from "../../../helpers/authenticationTokens";
import jwt from "jsonwebtoken";
import { isAuth } from "../../../helpers/is-auth";

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
    query = client.query;
  });

  // afterEach(async () => {
  // });

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

  it("should logout & delete the current logged in user, as well as delete all their data (exams,  tokens...)", async () => {
    const initialCount = await User.countDocuments();
    const initialUser = await User.findOne({ _id: testUser._id.toString() });
    expect(initialUser).toBeTruthy();

    const resp = await mutate({
      query: DELETE_USER_MUTATION,
      variables: {
        id: testUser._id.toString()
      }
    });

    expect(resp.data).toBeTruthy();
    const newCount = await User.countDocuments();
    expect(newCount).toBe(initialCount - 1);

    const userAfterDelete = await User.findOne({
      _id: testUser._id.toString()
    });
    console.log(userAfterDelete);
    expect(userAfterDelete).toBeFalsy();

    // const respCurrentUser = await query({
    //   query: CURRENT_USER
    // });
    // expect(respCurrentUser.data.currentUser).toBeFalsy();
    // expect(respCurrentUser.data.currentUser).toBe(null);
  });
});
