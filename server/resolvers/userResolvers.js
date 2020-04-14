//TODO: EXTRACT ALL DATABASE LOGIC TO APOLLO DATASOURCE: https://www.apollographql.com/docs/tutorial/data-source/
//TODO: RAFACTOR
import { User, Exam } from "../models";
import {
  // UserInputError,
  AuthenticationError,
  ApolloError
} from "apollo-server";
import { sendRefreshToken } from "../helpers/authenticationTokens";
import {
  handleResolverError,
  handleAuthentication
} from "../helpers/resolvers";

import {
  authenticateUser,
  signUserUp,
  logUserIn,
  signUpGoogleUser,
  invalidateRefreshTokens,
  invalidateAccessTokens,
  verifyGoogleIdToken,
  verifySignupInputFormat,
  verifyLoginInputFormat,
  verifyMascotInputFormat
} from "../helpers/userHelpers";

//TODO: Authenticate Queries
export const userResolvers = {
  Query: {
    //TODO: REMOVE
    users: (root, arg, { req, res, userInfo }, info) => {
      return User.find({});
    },
    //TODO: REMOVE
    user: (root, arg, context, info) => {
      return User.find({});
    },
    currentUser: async (parent, ars, { req, res, userInfo }) => {
      try {
        if (!userInfo.isAuth) return null;
        return userInfo.user;
      } catch (err) {
        console.error(err.message);
        return null;
      }
    }
  },
  Mutation: {
    logout: async (root, args, { req, res, userInfo }, info) => {
      try {
        handleAuthentication(userInfo);
        await logUserOut(res, userInfo.userId);
      } catch (err) {
        throw new ApolloError(err.message);
      }
      return true;
    },
    login: async (parent, { email, password }, context) => {
      try {
        if (context.userInfo.isAuth)
          throw new AuthenticationError("Already logged in.");
        verifyLoginInputFormat({ email, password });
        const user = await authenticateUser({ email, password });
        const accessToken = logUserIn({ user, context });
        // return { user: user, accessToken: accessToken, tokenExpiration: 15 };
        return accessToken;
      } catch (err) {
        handleResolverError(err);
      }
    },
    signup: async (parent, { username, email, password, mascot }, context) => {
      try {
        if (context.userInfo.isAuth)
          throw new AuthenticationError("Already logged in.");
        if (!mascot) mascot = 0; //TODO: maybe move
        verifySignupInputFormat({
          username,
          email,
          password,
          mascot: mascot.toString()
        });
        // console.log("MASCOT: " + mascot)
        const user = await signUserUp({
          username,
          email,
          password,
          mascot
        });
        // console.log()

        const accessToken = logUserIn({ user, context });
        // return { user, accessToken, tokenExpiration: 15 };
        return accessToken;
      } catch (err) {
        handleResolverError(err);
      }
    },
    updateMascot: async (parent, { mascot }, { req, res, userInfo }) => {
      try {
        handleAuthentication(userInfo);
        verifyMascotInputFormat({ mascot: mascot.toString() });
        if (userInfo.user.mascot === mascot) return true;

        const resp = await User.updateOne(
          { _id: userInfo.userId },
          { mascot: mascot, updatedAt: new Date() }
        );
        if (resp.ok === 0 || resp.nModified === 0)
          throw new ApolloError("The mascot couldn't be updated.");
        return true;
      } catch (err) {
        handleResolverError(err);
      }
    },
    googleLogin: async (parent, { idToken }, context) => {
      //https://developers.google.com/identity/sign-in/web/backend-auth
      try {
        const payload = await verifyGoogleIdToken(idToken);
        if (!payload)
          throw new AuthenticationError("Google id token was not verified.");
        let user = await User.findOne({ googleId: payload.sub });

        if (!user) user = await signUpGoogleUser(payload);

        const accessToken = logUserIn({ user, context });
        // return { user, accessToken, tokenExpiration: 15 };
        return accessToken;
      } catch (err) {
        handleResolverError(err);
      }
    },
    deleteUser: async (parent, args, context) => {
      try {
        handleAuthentication(context.userInfo);
        //TODO: DELETE EVERYTHING RELATED TO THE USER (CACHE...)
        await deleteUsersData(context.userInfo.userId);

        // await logUserOut(context.res, context.userInfo.userId);
        await deleteUser(context.userInfo.userId);

        return true;
      } catch (err) {
        handleResolverError(err);
      }
    }
  }
};

//TODO MOVE TO HELPERS FILE
async function logUserOut(res, userId) {
  sendRefreshToken(res, "");

  //invalidate current refresh tokens for user
  const respRefreshToken = await invalidateRefreshTokens(userId);

  if (!respRefreshToken)
    throw new ApolloError("Unable to revoke refresh token.");
  const respAccessToken = await invalidateAccessTokens(userId);

  if (!respAccessToken) throw new ApolloError("Unable to revoke access token.");
}

async function deleteUsersData(userId) {
  const respDeleteExams = await Exam.deleteMany({
    userId
  });

  if (respDeleteExams.ok !== 1)
    throw new ApolloError("The user's data couldn't be deleted");
}

async function deleteUser(userId) {
  const resp = await User.deleteOne({
    _id: userId
  });

  if (resp.ok !== 1 || resp.deletedCount !== 1)
    throw new ApolloError("The user couldn't be deleted");
}
