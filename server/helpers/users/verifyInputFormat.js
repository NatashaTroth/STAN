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
export function verifySignupInputFormat({ username, email, password, mascot }) {
  verifyUsernameFormat(username);
  verifyEmailFormat(email);
  verifyPasswordFormat(password);
  verifyMascotFormat(mascot);
}

export function verifyUpdateUserInputFormat({ username, email, mascot }) {
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
