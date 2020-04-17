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

//TODO: ADD MORE TESTS
describe("Test user sign up and login resolvers", () => {
  let server;
  let mutate;

  let testUser;
  let client;
  beforeAll(async () => {
    await setupDb();
    testUser = await signUpTestUser();
    testUser.googleLogin = true;
    server = await setupApolloServer({
      isAuth: true,
      userId: testUser._id,
      user: testUser
    });
    client = createTestClient(server);
    mutate = client.mutate;
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
        googleLogin: true,
        createdAt: 2020-04-07T13:39:55.593Z,
        _id: 5e8c82acb053b0c3482a8886,
        username: 'Samantha',
        email: 'samantha@stan.com',
        password: '$2b$10$zxgEwVDhvnkNc2nQsmjhjOGQXb9bRXfVOm/qAAvjZwRPmCRwBf3u2',
        __v: 0
      }
     */

  it("should not be able to update the current user", async () => {
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

    expect(resp.data).toBeFalsy();
    expect(resp.errors[0].message).toEqual(
      "Cannot update Google Login user account."
    );
  });
});
