//TODO: here and in exam resolvers, export error messages to separate file - so only have to change once and can also use in tests

import { User } from "../../models";
import { ApolloError } from "apollo-server";
import bcrypt from "bcrypt";
import {
  validatePassword,
  verifyUpdatePasswordInputFormat,
  verifyMascotInputFormat,
  verifyUpdateUserInputFormat
} from "./validateUserInput";
import { verifyEmailIsUnique } from "./userHelpers";

export async function handleUpdateUser(args, userInfo) {
  if (userInfo.user.googleLogin) throw new ApolloError("Cannot update Google Login user account.");
  verifyUpdateUserInputFormat({ ...args });
  return await updateUser({
    userId: userInfo.userId,
    currentUser: userInfo.user,
    ...args
  });
}

export async function handleUpdateMascot(mascot, userInfo) {
  verifyMascotInputFormat({ mascot });
  if (userInfo.user.mascot === mascot) return true;
  const resp = await User.updateOne({ _id: userInfo.userId }, { mascot, updatedAt: new Date() });
  if (resp.ok === 0 || resp.nModified === 0)
    throw new ApolloError("The mascot couldn't be updated.");
}

export async function updateUser(args) {
  if (args.email !== args.currentUser.email) await verifyEmailIsUnique(args.email);

  let passwordToSave = await getPasswordToSave(
    args.currentUser.password,
    args.password,
    args.newPassword
  );
  const resp = await User.updateOne(
    { _id: args.userId.toString() },
    {
      username: args.username,
      email: args.email,
      password: passwordToSave,
      mascot: args.mascot,
      allowEmailNotifications: args.allowEmailNotifications,
      updatedAt: new Date()
    }
  );

  if (resp.ok === 0 || resp.nModified === 0) throw new ApolloError("The user couldn't be updated.");

  return await User.findOne({
    _id: args.userId
  });
}

export function userWantsPasswordUpdating(password, newPassword) {
  return (password && password.length > 0) || (newPassword && newPassword.length > 0);
}

export async function getPasswordToSave(currentPassword, inputOldPassword, inputNewPassword) {
  if (userWantsPasswordUpdating(inputOldPassword, inputNewPassword)) {
    await validatePassword(inputOldPassword, currentPassword);
    verifyUpdatePasswordInputFormat(inputNewPassword);
    return await bcrypt.hash(inputNewPassword, 10);
  }
  return currentPassword;
}
