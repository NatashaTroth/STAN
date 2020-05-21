import {
  verifyRegexEmail,
  verifyRegexUsername,
  verifyRegexPassword,
  verifyRegexMascot
} from "../verifyInput";
import {
  // UserInputError,
  AuthenticationError
} from "apollo-server";
import validator from "validator";
import bcrypt from "bcrypt";

import { OAuth2Client } from "google-auth-library";
import { User } from "../../models";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export async function validatePassword(inputPassword, userPassword) {
  try {
    if (!verifyRegexPassword(inputPassword)) throw new Error();
    const valid = await bcrypt.compare(inputPassword, userPassword);
    if (!valid) throw new Error();
  } catch (err) {
    throw new AuthenticationError("Password is incorrect.");
  }
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
