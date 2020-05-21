//TODO: here and in exam resolvers, export error messages to separate file - so only have to change once and can also use in tests

import { User } from "../../models";
import { verifyEmailIsUnique } from "./userHelpers";
import { UserInputError, AuthenticationError } from "apollo-server";
import bcrypt from "bcrypt";

export async function signUserUp({
  username,
  email,
  password,
  mascot,
  googleId,
  googleLogin,
  allowEmailNotifications
}) {
  // const userWithEmail = await User.findOne({ email: email });
  // if (userWithEmail)
  //   throw new UserInputError("User with email already exists. Have you forgotten your password?");
  await verifyEmailIsUnique(email);
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
