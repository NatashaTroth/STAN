import {
  verifyRegexEmail,
  verifyRegexUsername,
  verifyRegexPassword,
  verifyRegexMascot
} from "../verifyInput";
import {
  // UserInputError,
  AuthenticationError,
  ApolloError
} from "apollo-server";
import validator from "validator";
import bcrypt from "bcrypt";

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

export async function validatePassword(inputPassword, userPassword) {
  try {
    if (!verifyRegexPassword(inputPassword)) throw new Error();
    const valid = await bcrypt.compare(inputPassword, userPassword);
    if (!valid) throw new Error();
  } catch (err) {
    throw new AuthenticationError("Password is incorrect.");
  }
}
