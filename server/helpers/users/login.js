import {
  createAccessToken,
  createRefreshToken
} from "../authentication/authenticationTokens";
import { sendRefreshToken } from "../authentication/authenticationTokens";
import { validatePassword } from "./validateUserInput";

import {
  // UserInputError,
  AuthenticationError
} from "apollo-server";

import { User } from "../../models";

import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
export function logUserIn({ user, res }) {
  let userAccessToken = createAccessToken(user);
  sendRefreshToken(res, createRefreshToken(user));
  return userAccessToken;
}

export async function authenticateUser({ email, password }) {
  const user = await User.findOne({ email: email });
  if (!user)
    throw new AuthenticationError("User with this email does not exist.");

  //in case user tries to login with google login data in normal login - cause no password!
  if (user.googleLogin)
    throw new AuthenticationError("User has to login with google.");
  await validatePassword(password, user.password);
  return user;
}

//source: https://developers.google.com/identity/sign-in/web/backend-auth
export async function verifyGoogleIdToken(token) {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_CLIENT_ID
  });
  const payload = ticket.getPayload();
  return payload;
}
