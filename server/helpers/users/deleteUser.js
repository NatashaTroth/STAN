//TODO: here and in exam resolvers, export error messages to separate file - so only have to change once and can also use in tests

import { User, Exam, TodaysChunkCache } from "../../models";
import { ApolloError } from "apollo-server";
import { sendRefreshToken } from "../authentication/authenticationTokens";

import StanEmail from "../StanEmail";
const stanEmail = new StanEmail();

//TODAY: export exam.deletemany into examhelpers

export async function handleDeleteUser(res, userInfo) {
  await deleteUsersData(userInfo.userId);
  sendRefreshToken(res, "");
  await deleteUser(userInfo.userId);
  if (userInfo.user.allowEmailNotifications)
    stanEmail.sendDeleteAccountMail(userInfo.user.email, userInfo.user.mascot);
}

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
