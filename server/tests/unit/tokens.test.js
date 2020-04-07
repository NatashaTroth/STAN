import { createAccessToken } from "../../authenticationTokens";
import "dotenv/config";
import jwt from "jsonwebtoken";

test("Valid access token should be created", () => {
  let accessToken;
  try {
    accessToken = createAccessToken();
    expect(false).toBeTruthy();
    throw new Error("Error wasn't thrown");
  } catch (err) {
    expect(accessToken).toBeFalsy();
    expect(err.message).toBe(
      "User object is empty, cannot create access token."
    );
  }

  const user = { id: "testUserId", tokenVersion: 0 };
  accessToken = createAccessToken(user);
  const decodedToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
  expect(decodedToken).toBeTruthy();
  expect(decodedToken.userId).toBe(user.id);
  expect(decodedToken.tokenVersion).toBe(0);
});
