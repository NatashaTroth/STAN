//TODO: here and in exam resolvers, export error messages to separate file - so only have to change once and can also use in tests

import { User } from "../../models";
import { verifyEmailIsUnique } from "./userHelpers";
import { UserInputError, AuthenticationError } from "apollo-server";
import bcrypt from "bcrypt";
import { verifySignupInputFormat } from "./validateUserInput";
import { createLoginTokens } from "./../authentication/authenticationTokens";
import StanEmail from "./../StanEmail";

export async function handleSignUp(args, res) {
  if (!args.mascot) args.mascot = 0;
  verifySignupInputFormat({ ...args });
  const user = await signUserUp({ ...args });
  const accessToken = createLoginTokens({ user, res });
  //TODO CHANGE EMAIL
  const stanEmail = new StanEmail();
  if (args.allowEmailNotifications) stanEmail.sendSignupMail(args.email, args.mascot);
  return accessToken;
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
