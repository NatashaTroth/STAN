//TODO: EXTRACT ALL DATABASE LOGIC TO APOLLO DATASOURCE: https://www.apollographql.com/docs/tutorial/data-source/
//TODO: RAFACTOR
import { User } from "../models";
import {
  UserInputError,
  AuthenticationError,
  ApolloError
} from "apollo-server";
import { createAccessToken, createRefreshToken } from "../authenticationTokens";
import { sendRefreshToken } from "../authenticationTokens";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import {
  verifyRegexEmail,
  verifyRegexUsername,
  verifyRegexPassword,
  verifyRegexMascot
} from "../helpers/verifyUserInput";
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
import {
  handleResolverError,
  handleAuthentication
} from "../helpers/resolvers";

import {
  authenticateUser,
  signUserUp,
  logUserIn,
  signUpGoogleUser,
  revokeRefreshTokensForUser,
  verifyGoogleIdToken,
  verifyUserInputFormat
} from "../helpers/userHelpers";

//TODO: Authenticate Queries
const userResolvers = {
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
    logout: (root, args, { req, res, userInfo }, info) => {
      try {
        handleAuthentication(userInfo);
        sendRefreshToken(res, "");
        //invalidate current refresh tokens for user
        const resp = revokeRefreshTokensForUser(userInfo.userId);
        if (!resp) throw new ApolloError("Unable to revoke refresh token");
      } catch (err) {
        throw new ApolloError(err.message);
      }
      return true;
    },
    login: async (parent, { email, password }, context) => {
      try {
        if (context.userInfo.isAuth)
          throw new AuthenticationError("Already logged in");
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
          throw new AuthenticationError("Already logged in");
        verifyUserInputFormat({ username, email, password });
        const user = await signUserUp({
          username,
          email,
          password,
          mascot
        });

        const accessToken = logUserIn({ user, context });
        return { user, accessToken, tokenExpiration: 15 };
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
        // resp = authenticateGoogleUser(user); //if already got account don't think i need to authenticate user cause google already did that

        if (!user) user = await signUpGoogleUser(payload);

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
    }
  }
};

module.exports = {
  userResolvers
};
