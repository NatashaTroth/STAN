//TODO: EXTRACT ALL DATABASE LOGIC TO APOLLO DATASOURCE: https://www.apollographql.com/docs/tutorial/data-source/
//TODO: RAFACTOR
import { User } from "../models";
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
  verifyUserInputFormat
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
        sendRefreshToken(res, "");
        //invalidate current refresh tokens for user
        const respRefreshToken = await invalidateRefreshTokens(userInfo.userId);
        if (!respRefreshToken)
          throw new ApolloError("Unable to revoke refresh token.");
        const respAccessToken = await invalidateAccessTokens(userInfo.userId);

        if (!respAccessToken)
          throw new ApolloError("Unable to revoke access token.");
      } catch (err) {
        throw new ApolloError(err.message);
      }
      return true;
    },
    login: async (parent, { email, password }, context) => {
      try {
        if (context.userInfo.isAuth)
          throw new AuthenticationError("Already logged in.");
        verifyUserInputFormat({ email, password });
        const user = await authenticateUser({ email, password });
        const accessToken = logUserIn({ user, context });
        return { user: user, accessToken: accessToken, tokenExpiration: 15 };
      } catch (err) {
        handleResolverError(err);
      }
    },
    signup: async (parent, { username, email, password, mascot }, context) => {
      try {
        if (context.userInfo.isAuth)
          throw new AuthenticationError("Already logged in.");
        if (!mascot) mascot = 0; //TODO: maybe move
        verifyUserInputFormat({
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
        return { user, accessToken, tokenExpiration: 15 };
      } catch (err) {
        handleResolverError(err);
      }
    },
    updateMascot: async (parent, { mascot }, { req, res, userInfo }) => {
      try {
        handleAuthentication(userInfo);
        verifyUserInputFormat({ mascot: mascot.toString() });
        if (userInfo.user.mascot === mascot) return true;
        const resp = await User.updateOne(
          { _id: userInfo.userId },
          { mascot: mascot }
        );
        if (resp.nModified === 0) return false;
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
        return { user, accessToken, tokenExpiration: 15 };
      } catch (err) {
        handleResolverError(err);
      }
    }
  }
};
