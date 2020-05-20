//TODO: here and in exam resolvers, export error messages to separate file - so only have to change once and can also use in tests

import { User, Exam, TodaysChunkCache } from "../../models";
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
import { verifyRegexPassword } from "../verifyInput";
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
// import { handleResolverError } from "../resolvers";
// import { totalDurationCompleted } from "../helpers/chunks";
import { escapeStringForHtml, handleResolverError } from "../generalHelpers";
import validator from "validator";
import { validatePassword } from "./validateUserInput";
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
