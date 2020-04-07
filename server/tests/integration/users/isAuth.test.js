import { createAccessToken } from "../../../helpers/authenticationTokens";
import { isAuth } from "../../../helpers/is-auth";
import "dotenv/config";
import jwt from "jsonwebtoken";

import { setupApolloServer, setupDb, signUpTestUser, teardown } from "../setup";

describe("Test user sign up and login resolvers", () => {
  let server;

  let testUser;
  beforeAll(async () => {
    await setupDb();
    testUser = await signUpTestUser();
    server = await setupApolloServer({ isAuth: false });
  });

  afterAll(async () => {
    await teardown();
  });

  it("tests isAuth", async () => {
    const headers = new Map();

    const user = { id: testUser._id, accessTokenVersion: 0 };
    const accessToken = createAccessToken(user);
    const decodedToken = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET
    );
    expect(decodedToken).toBeTruthy();

    headers.set("Authorization", "bearer " + accessToken);
    const resp = await isAuth(headers);

    expect(resp).toBeTruthy();
    expect(resp.isAuth).toBeTruthy();
    expect(resp.userId).toBe(testUser._id.toString());
    expect(resp.user).toBeTruthy();
    expect(resp.user.id.toString()).toBe(testUser._id.toString());
    expect(resp.user.username).toBe(testUser.username);
    expect(resp.user.email).toBe(testUser.email);
    expect(resp.user.mascot).toBe(testUser.mascot);
    expect(resp.user.googleLogin).toBe(testUser.googleLogin);
    expect(true).toBeTruthy();
  });
});
