import {
  createAccessToken,
  createRefreshToken
} from "../../authenticationTokens";
import "dotenv/config";
import jwt, { decode } from "jsonwebtoken";

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

  //Date.now() -> amount of ms since jan 01. 1970
  //jwt token exp -> amount of sec since jan 01. 1970
  //900 sec in 15 min

  //token should be valid now:
  expect(Date.now() / 1000 <= decodedToken.exp).toBeTruthy();
  //token should be valid in 500 sec
  expect(Date.now() / 1000 + 500 <= decodedToken.exp).toBeTruthy();
  //token should not be valid in 15 min
  expect(Date.now() / 1000 + 900 <= decodedToken.exp).toBeFalsy();
});

test("Valid refresh token should be created", () => {
  let refreshToken;
  try {
    refreshToken = createRefreshToken();
    expect(false).toBeTruthy();
    throw new Error("Error wasn't thrown");
  } catch (err) {
    expect(refreshToken).toBeFalsy();
    expect(err.message).toBe(
      "User object is empty, cannot create refresh token"
    );
  }

  const user = { id: "testUserId", tokenVersion: 0 };
  refreshToken = createRefreshToken(user);
  const decodedToken = jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET
  );
  expect(decodedToken).toBeTruthy();
  expect(decodedToken.userId).toBe(user.id);
  expect(decodedToken.tokenVersion).toBe(0);

  //Date.now() -> amount of ms since jan 01. 1970
  //jwt token exp -> amount of sec since jan 01. 1970
  //604800 sec in 7d

  //token should be valid now:
  expect(Date.now() / 1000 <= decodedToken.exp).toBeTruthy();
  //token should be valid in 15 min
  expect(Date.now() / 1000 + 900 <= decodedToken.exp).toBeTruthy();

  //token should be valid in 600000 sec
  expect(Date.now() / 1000 + 600000 <= decodedToken.exp).toBeTruthy();
  //token should not be valid in 7 d
  expect(Date.now() / 1000 + 604800 <= decodedToken.exp).toBeFalsy();
});
