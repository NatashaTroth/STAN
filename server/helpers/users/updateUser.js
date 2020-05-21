//TODO: here and in exam resolvers, export error messages to separate file - so only have to change once and can also use in tests

import { User } from "../../models";
import { ApolloError } from "apollo-server";

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
