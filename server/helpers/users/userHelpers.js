//TODO: here and in exam resolvers, export error messages to separate file - so only have to change once and can also use in tests

import { User } from "../../models";
import {
  UserInputError,
  AuthenticationError,
  ApolloError
} from "apollo-server";
import {
  createAccessToken,
  createRefreshToken
} from "../authentication/authenticationTokens";
import { sendRefreshToken } from "../authentication/authenticationTokens";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
import { escapeStringForHtml, handleResolverError } from "../generalHelpers";

import { validatePassword } from "./validateUserInput";
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

export async function updateUserLastVisited(userId) {
  await User.updateOne(
    { _id: userId },
    {
      lastVisited: new Date(),
      sentOneMonthDeleteReminder: false,
      updatedAt: new Date()
    }
  );
}

//TODO:  the revoke code should be used in a method, say if password forgotton / change password or user account hacked - closes all open sessions
export async function invalidateRefreshTokens(userId) {
  //TODO: NOT THROWING THE ERRORS TO THE CLIENT - PRINTING THEM TO SERVER CONSOLE ON LOGOUT
  try {
    const resp = await User.updateOne(
      { _id: userId },
      { $inc: { refreshTokenVersion: 1 }, updatedAt: new Date() }
    );
    if (resp.nModified === 0)
      throw Error("Refresh token version was not increased.");

    return true;
  } catch (err) {
    handleResolverError(err);
  }
}
//TODO: MOVE TOKEN HELPERS TO TOKEN FILE
export async function invalidateAccessTokens(userId) {
  try {
    const resp = await User.updateOne(
      { _id: userId },
      { $inc: { accessTokenVersion: 1 }, updatedAt: new Date() }
    );
    if (resp.nModified === 0)
      throw Error("Access token version was not increased.");
    return true;
  } catch (err) {
    handleResolverError(err);
  }
}

export async function logUserOut(res, userId) {
  sendRefreshToken(res, "");

  //invalidate current refresh tokens for user
  const respRefreshToken = await invalidateRefreshTokens(userId);

  if (!respRefreshToken)
    throw new ApolloError("Unable to revoke refresh token.");
  const respAccessToken = await invalidateAccessTokens(userId);

  if (!respAccessToken) throw new ApolloError("Unable to revoke access token.");
}

export async function updateUserInDatabase(
  userId,
  username,
  email,
  passwordToSave,
  mascot,
  allowEmailNotifications
) {
  const updatedUser = {
    username,
    email,
    password: passwordToSave,
    mascot,
    allowEmailNotifications
  };

  const resp = await User.updateOne(
    { _id: userId.toString() },
    { ...updatedUser, updatedAt: new Date() }
  );

  if (resp.ok === 0 || resp.nModified === 0)
    throw new ApolloError("The user couldn't be updated.");
}

export function userWantsPasswordUpdating(password, newPassword) {
  return (
    (password && password.length > 0) || (newPassword && newPassword.length > 0)
  );
}

export async function createForgottenPasswordEmailLink(email) {
  const user = await User.findOne({ email });

  if (!user) throw new ApolloError("There is no user with that email address.");

  const secret = createForgottenPasswordSecret(user);

  // const token = jwt.encode(payload, secret)
  const token = jwt.sign({ userId: user._id, userEmail: email }, secret, {
    expiresIn: "10m"
  });
  // return process.env.CLIENT_URL + "/" + user._id + "/" + token;
  return `${process.env.CLIENT_URL}/resetpassword/${user._id}/${token}`;
}

export function createForgottenPasswordSecret(user) {
  return (
    user.password +
    "-" +
    user.updatedAt.getTime() +
    process.env.FORGOTTEN_PASSWORD_SECRET
  );
}

export function escapeUserObject(user) {
  user.username = escapeStringForHtml(user.username);
  user.email = escapeStringForHtml(user.email);
  return user;
}

export function validateForgottenPasswordToken(user, token, secret) {
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, secret);
    if (!decodedToken) throw new Error();
  } catch (err) {
    throw new Error(
      "Invalid url. Please use the forgotten password button to try again."
    );
  }
  if (decodedToken.userId.toString() !== user._id.toString())
    throw new Error("Wrong user in the forgotten password token.");

  if (decodedToken.userEmail !== user.email)
    throw new Error("Wrong user email in the forgotten password token.");
}
