//TODO: EXTRACT ALL DATABASE LOGIC TO APOLLO DATASOURCE: https://www.apollographql.com/docs/tutorial/data-source/

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
import bcrypt from "bcrypt";

// import sanitizer from "sanitize";
// import validator from "validator";

import {
  authenticateUser,
  signUserUp,
  logUserIn,
  signUpGoogleUser,
  verifyGoogleIdToken,
  verifySignupInputFormat,
  verifyLoginInputFormat,
  verifyMascotInputFormat,
  verifyUpdateUserInputFormat,
  verifyUpdatePasswordInputFormat,
  logUserOut,
  deleteUsersData,
  deleteUser,
  validatePassword,
  updateUserInDatabase,
  userWantsPasswordUpdating
  // calculateUserState
} from "../helpers/userHelpers";

import StanEmail from "../helpers/StanEmail";
const stanEmail = new StanEmail();
// import { escapeObjectForHtml } from "../helpers/generalHelpers";
//TODO CHANGE

//TODO: Authenticate Queries
export const userResolvers = {
  Query: {
    currentUser: async (parent, ars, { req, res, userInfo }) => {
      try {
        if (!userInfo.isAuth) return null;
        // let user = {
        //   id: userInfo.userId,
        //   googleId: userInfo.user.googleId,
        //   username: userInfo.user.username,
        //   email: userInfo.user.email,
        //   mascot: userInfo.user.mascot,
        //   googleLogin: userInfo.user.googleLogin
        // };
        // user = escapeObjectForHtml({ ...user });

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
    signup: async (
      parent,
      { username, email, password, mascot, allowEmailNotifications },
      context
    ) => {
      try {
        if (context.userInfo.isAuth)
          throw new AuthenticationError("Already logged in.");
        if (!mascot) mascot = 0;
        verifySignupInputFormat({
          username,
          email,
          password,
          mascot: mascot.toString()
        });

        const user = await signUserUp({
          username,
          email,
          password,
          mascot,
          allowEmailNotifications
        });

        const accessToken = logUserIn({ user, context });
        if (allowEmailNotifications) stanEmail.sendSignupMail(email, mascot);
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
        if (context.userInfo.isAuth)
          throw new AuthenticationError("Already logged in.");
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
    updateUser: async (
      parent,
      {
        username,
        email,
        password,
        newPassword,
        mascot,
        allowEmailNotifications
      },
      context
    ) => {
      try {
        handleAuthentication(context.userInfo);
        const user = context.userInfo.user;
        if (user.googleLogin)
          throw new ApolloError("Cannot update Google Login user account.");
        verifyUpdateUserInputFormat({
          username,
          email,
          mascot: mascot.toString()
        });
        let passwordToSave = user.password;
        if (userWantsPasswordUpdating(password, newPassword)) {
          // console.log("USER WANTS PASSWORD UPDATING");

          await validatePassword(password, user.password);
          // console.log("Password is validated");
          verifyUpdatePasswordInputFormat(newPassword);
          passwordToSave = await bcrypt.hash(newPassword, 10);
        }
        // console.log("passwordToSave: " + passwordToSave);

        await updateUserInDatabase(
          context.userInfo.userId,
          username,
          email,
          passwordToSave,
          mascot,
          allowEmailNotifications
        );

        return await User.findOne({ _id: context.userInfo.userId });
      } catch (err) {
        handleResolverError(err);
      }
    },

    deleteUser: async (parent, args, context) => {
      try {
        handleAuthentication(context.userInfo);
        //TODO: DELETE EVERYTHING RELATED TO THE USER (CACHE...)
        await deleteUsersData(context.userInfo.userId);
        sendRefreshToken(context.res, "");

        await deleteUser(context.userInfo.userId);
        if (context.userInfo.user.allowEmailNotifications)
          stanEmail.sendDeleteAccountMail(
            context.userInfo.user.email,
            context.userInfo.user.mascot
          );
        return true;
      } catch (err) {
        handleResolverError(err);
      }
    }
  }
};
