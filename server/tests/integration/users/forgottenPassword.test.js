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
import { RESET_PASSWORD_MUTATION } from "../../mutations.js";
import { FORGOTTEN_PASSWORD_EMAIL } from "../../queries.js";
import jwt from "jsonwebtoken";

import { User } from "../../../models";
import {
  createForgottenPasswordEmailLink,
  createForgottenPasswordSecret,
  validateForgottenPasswordToken
} from "../../../helpers/userHelpers";
import bcrypt from "bcrypt";

describe("Test forgotten password resolver/helpers", () => {
  let server;
  let mutate;
  let query;

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
    query = client.query;
  });

  afterEach(async () => {
    await clearDatabase();
  });

  afterAll(async () => {
    await clearDatabase();
    await teardown();
  });

  it("should update the users password correctly", async () => {
    // console.log(await User.findOne({ email: testUser.email }));
    //create the email link
    const secret = createForgottenPasswordSecret(testUser);
    const token = jwt.sign(
      { userId: testUser._id, userEmail: testUser.email },
      secret,
      {
        expiresIn: "10m"
      }
    );
    // const link = createForgottenPasswordEmailLink(testUser.email);
    //   expect(link).toBeTruthy();
    //   expect(link).toBe(
    //     process.env.CLIENT_URL + "/" + testUser._id + "/" + token
    //   );
  });
});
