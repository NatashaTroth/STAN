//TODO: here and in exam resolvers, export error messages to separate file - so only have to change once and can also use in tests

import { User } from "../models";
import { UserInputError, AuthenticationError } from "apollo-server";
import { createAccessToken, createRefreshToken } from "./authenticationTokens";
import { sendRefreshToken } from "./authenticationTokens";
import bcrypt from "bcrypt";

import { OAuth2Client } from "google-auth-library";
import {
  verifyRegexEmail,
  verifyRegexUsername,
  verifyRegexPassword,
  verifyRegexMascot
} from "../helpers/verifyUserInput";
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
import { handleResolverError } from "../helpers/resolvers";

export async function authenticateUser({ email, password }) {
  const user = await User.findOne({ email: email });
  if (!user)
    throw new AuthenticationError("User with this email does not exist.");

  //in case user tries to login with google login data in normal login - cause no password!
  if (user.googleLogin)
    throw new AuthenticationError("User has to login with google.");

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new AuthenticationError("Password is incorrect.");
  return user;
}

export async function signUserUp({
  username,
  email,
  password,
  mascot,
  googleId,
  googleLogin
}) {
  const userWithEmail = await User.findOne({ email: email });
  if (userWithEmail)
    throw new UserInputError("User with email already exists.");
  let hashedPassword;
  if (googleLogin) hashedPassword = null;
  else hashedPassword = await bcrypt.hash(password, 10);
  const resp = await User.create({
    username,
    email,
    password: hashedPassword,
    mascot: mascot || 0,
    googleId: googleId || "",
    googleLogin: googleLogin || false
  });

  if (!resp) throw new AuthenticationError("User could not be created.");
  return resp;
}

export function logUserIn({ user, context }) {
  let userAccessToken = createAccessToken(user);
  sendRefreshToken(context.res, createRefreshToken(user));
  return userAccessToken;
}

export function signUpGoogleUser(payload) {
  return signUserUp({
    username: payload.name,
    email: payload.email,
    password: null,
    googleId: payload.sub,
    googleLogin: true
    // mascot: 1 //TODO GET MASCOT USER CHOSE
  });
}

//TODO:  the revoke code should be used in a method, say if password forgotton / change password or user account hacked - closes all open sessions
export async function invalidateRefreshTokens(userId) {
  //TODO: NOT THROWING THE ERRORS TO THE CLIENT - PRINTING THEM TO SERVER CONSOLE ON LOGOUT
  try {
    const resp = await User.updateOne(
      { _id: userId },
      { $inc: { refreshTokenVersion: 1 } }
    );
    if (resp.nModified === 0)
      throw Error("Refresh token version was not increased.");

    return true;
  } catch (err) {
    handleResolverError(err);
  }
}
export async function invalidateAccessTokens(userId) {
  try {
    const resp = await User.updateOne(
      { _id: userId },
      { $inc: { accessTokenVersion: 1 } }
    );
    if (resp.nModified === 0)
      throw Error("Access token version was not increased.");
    return true;
  } catch (err) {
    handleResolverError(err);
  }
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

export function verifySignupInputFormat({ username, email, password, mascot }) {
  verifyUsernameFormat(username);
  verifyEmailFormat(email);
  verifyPasswordFormat(password);
  verifyMascotFormat(mascot);
}

export function verifyLoginInputFormat({ email, password }) {
  verifyEmailFormat(email);
  verifyPasswordFormat(password);
}

export function verifyMascotInputFormat({ mascot }) {
  verifyMascotFormat(mascot);
}

function verifyUsernameFormat(username) {
  if (!verifyRegexUsername(username))
    throw new Error(
      "Username input has the wrong format. It cannot be empty. Max length 30 characters."
    );
}

function verifyEmailFormat(email) {
  if (typeof email !== "undefined" && !verifyRegexEmail(email))
    throw new Error("Email input has the wrong format.");
}

function verifyPasswordFormat(password) {
  if (typeof password !== "undefined" && !verifyRegexPassword(password))
    throw new Error(
      "Password input has the wrong format. It must contain at least 8 characters. Max length 30 characters."
    );
}

function verifyMascotFormat(mascot) {
  if (typeof mascot !== "undefined" && !verifyRegexMascot(mascot))
    throw new Error(
      "Mascot input has the wrong format. It must be one of the following numbers: 0, 1, 2."
    );
}
