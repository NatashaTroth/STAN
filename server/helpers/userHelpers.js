//TODO: here and in exam resolvers, export error messages to separate file - so only have to change once and can also use in tests

import { User, Exam, TodaysChunkCache } from "../models";
import {
  UserInputError,
  AuthenticationError,
  ApolloError
} from "apollo-server";
import { createAccessToken, createRefreshToken } from "./authenticationTokens";
import { sendRefreshToken } from "./authenticationTokens";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { OAuth2Client } from "google-auth-library";
import {
  verifyRegexEmail,
  verifyRegexUsername,
  verifyRegexPassword,
  verifyRegexMascot
} from "../helpers/verifyUserInput";
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
import { handleResolverError } from "../helpers/resolvers";
// import { totalDurationCompleted } from "../helpers/chunks";
import { escapeStringForHtml } from "./generalHelpers";
import validator from "validator";

export async function authenticateUser({ email, password }) {
  const user = await User.findOne({ email: email });
  if (!user)
    throw new AuthenticationError("User with this email does not exist.");

  //in case user tries to login with google login data in normal login - cause no password!
  if (user.googleLogin)
    throw new AuthenticationError("User has to login with google.");
  await validatePassword(password, user.password);
  // try {
  //   const valid = await bcrypt.compare(password, user.password);
  //   if (!valid) throw new AuthenticationError("Password is incorrect.");
  // } catch (err) {
  //   throw new AuthenticationError("Password is incorrect.");
  // }

  return user;
}

export async function signUserUp({
  username,
  email,
  password,
  mascot,
  googleId,
  googleLogin,
  allowEmailNotifications
}) {
  const userWithEmail = await User.findOne({ email: email });
  if (userWithEmail)
    throw new UserInputError(
      "User with email already exists. Have you forgotten your password?"
    );
  let hashedPassword;
  if (googleLogin) hashedPassword = null;
  else hashedPassword = await bcrypt.hash(password, 10);
  const resp = await User.create({
    username,
    email,
    password: hashedPassword,
    mascot: mascot || 0,
    googleId: googleId || "",
    googleLogin: googleLogin || false,
    allowEmailNotifications
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

//source: https://developers.google.com/identity/sign-in/web/backend-auth
export async function verifyGoogleIdToken(token) {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_CLIENT_ID
  });
  const payload = ticket.getPayload();
  return payload;
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

//TODAY: export exam.deletemany into examhelpers
export async function deleteUsersData(userId) {
  const respDeleteExams = await Exam.deleteMany({
    userId
  });
  const respDeleteTodaysChunkCache = await TodaysChunkCache.deleteMany({
    userId
  });

  if (respDeleteExams.ok !== 1 || respDeleteTodaysChunkCache.ok !== 1)
    throw new ApolloError("The user's data couldn't be deleted");
}

export async function deleteUser(userId) {
  const resp = await User.deleteOne({
    _id: userId
  });

  if (resp.ok !== 1 || resp.deletedCount !== 1)
    throw new ApolloError(
      "The user couldn't be deleted. Please contact us at stan.studyplan@gmail.com, to delete your account."
    );
}

export async function validatePassword(inputPassword, userPassword) {
  try {
    if (!verifyRegexPassword(inputPassword)) throw new Error();
    const valid = await bcrypt.compare(inputPassword, userPassword);
    if (!valid) throw new Error();
  } catch (err) {
    throw new AuthenticationError("Password is incorrect.");
  }
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
    updatedAt: new Date(),
    allowEmailNotifications
  };

  const resp = await User.updateOne(
    { _id: userId.toString() },
    { ...updatedUser }
  );

  if (resp.ok === 0 || resp.nModified === 0)
    throw new ApolloError("The user couldn't be updated.");
}

export function userWantsPasswordUpdating(password, newPassword) {
  // if (!password || password.length <= 0) return false;
  // if (!newPassword || newPassword.length <= 0) return false;
  // return true;
  return (
    (password && password.length > 0) || (newPassword && newPassword.length > 0)
  );
  // return (
  //   password && password.length > 0 && newPassword && newPassword.length > 0
  // );
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

export function verifySignupInputFormat({ username, email, password, mascot }) {
  verifyUsernameFormat(username);
  verifyEmailFormat(email);
  verifyPasswordFormat(password);
  verifyMascotFormat(mascot);
}

export function verifyUpdateUserInputFormat({
  username,
  email,
  password,
  mascot
}) {
  verifyUsernameFormat(username);
  verifyEmailFormat(email);
  verifyMascotFormat(mascot);
}

export function verifyUpdatePasswordInputFormat(password) {
  try {
    verifyPasswordFormat(password);
  } catch (err) {
    throw new Error(
      "New password input has the wrong format. It must contain at least 8 characters. Max length 30 characters."
    );
  }
}

// export function updateUser({ username, email, password, mascot }) {
//   verifyUsernameFormat(username);
//   verifyEmailFormat(email);
//   verifyPasswordFormat(password);
//   verifyMascotFormat(mascot);
// }

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

export function verifyEmailFormat(email) {
  if (!verifyRegexEmail(email) || !validator.isEmail(email))
    throw new Error("Email input has the wrong format.");
}

export function verifyPasswordFormat(password) {
  if (!verifyRegexPassword(password))
    throw new Error(
      "Password input has the wrong format. It must contain at least 8 characters. Max length 30 characters."
    );
}

function verifyMascotFormat(mascot) {
  if (!verifyRegexMascot(mascot))
    throw new Error(
      "Mascot input has the wrong format. It must be one of the following numbers: 0, 1, 2."
    );
}
