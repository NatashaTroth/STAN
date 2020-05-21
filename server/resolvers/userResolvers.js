//TODO: EXTRACT ALL DATABASE LOGIC TO APOLLO DATASOURCE: https://www.apollographql.com/docs/tutorial/data-source/

import { User } from "../models";
import {
  // UserInputError,
  AuthenticationError,
  ApolloError
} from "apollo-server";
import { sendRefreshToken } from "../helpers/authentication/authenticationTokens";
import {
  handleResolverError,
  handleAuthentication,
  handleAuthenticationAlreadyLoggedIn
} from "../helpers/generalHelpers";
import bcrypt from "bcrypt";

import { escapeUserObject, updateUserLastVisited } from "../helpers/users/userHelpers";

import {
  updateUser,
  userWantsPasswordUpdating,
  getPasswordToSave
} from "../helpers/users/updateUser";

import {
  createForgottenPasswordEmailLink,
  createForgottenPasswordSecret,
  validateForgottenPasswordToken
} from "../helpers/users/forgottenPassword";
import {
  validatePassword,
  verifySignupInputFormat,
  verifyLoginInputFormat,
  verifyMascotInputFormat,
  verifyUpdateUserInputFormat,
  verifyUpdatePasswordInputFormat,
  verifyEmailFormat
} from "../helpers/users/validateUserInput";

import { deleteUsersData, deleteUser } from "../helpers/users/deleteUser";
import { signUserUp, signUpGoogleUser } from "../helpers/users/signup";
import { logUserIn, authenticateUser, verifyGoogleIdToken } from "../helpers/users/login";
import { logUserOut } from "../helpers/users/logout";
import StanEmail from "../helpers/StanEmail";
const stanEmail = new StanEmail();
// import { escapeObjectForHtml } from "../helpers/generalHelpers";
//TODO CHANGE

//TODO: Authenticate Queries
export const userResolvers = {
  Query: {
    currentUser: async (_, __, { userInfo }) => {
      try {
        if (!userInfo.isAuth) return null;
        updateUserLastVisited(userInfo.userId);
        return escapeUserObject(userInfo.user);
      } catch (err) {
        console.error(err.message);
        return null;
      }
    }
  },
  Mutation: {
    logout: async (_, __, { res, userInfo }) => {
      try {
        handleAuthentication(userInfo);
        await logUserOut(res, userInfo.userId);
      } catch (err) {
        throw new ApolloError(err.message);
      }
      return true;
    },
    login: async (_, { email, password }, { res, userInfo }) => {
      try {
        handleAuthenticationAlreadyLoggedIn(userInfo);
        verifyLoginInputFormat({ email, password });
        const user = await authenticateUser({ email, password });
        const accessToken = logUserIn({ user, res });
        // return { user: user, accessToken: accessToken, tokenExpiration: 15 };
        return accessToken;
      } catch (err) {
        handleResolverError(err);
      }
    },
    signup: async (
      _,
      { username, email, password, mascot = 0, allowEmailNotifications },
      { res, userInfo }
    ) => {
      try {
        handleAuthenticationAlreadyLoggedIn(userInfo);
        verifySignupInputFormat({
          username,
          email,
          password,
          mascot
        });
        const user = await signUserUp({
          username,
          email,
          password,
          mascot,
          allowEmailNotifications
        });
        const accessToken = logUserIn({ user, res });
        if (allowEmailNotifications) stanEmail.sendSignupMail(email, mascot);
        return accessToken;
      } catch (err) {
        handleResolverError(err);
      }
    },
    updateMascot: async (_, { mascot }, { userInfo }) => {
      try {
        handleAuthentication(userInfo);
        verifyMascotInputFormat({ mascot: mascot });
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
    googleLogin: async (_, { idToken }, { res, userInfo }) => {
      //https://developers.google.com/identity/sign-in/web/backend-auth
      try {
        handleAuthenticationAlreadyLoggedIn(userInfo);
        const payload = await verifyGoogleIdToken(idToken);
        if (!payload) throw new AuthenticationError("Google id token was not verified.");
        let user = await User.findOne({ googleId: payload.sub });
        if (!user) user = await signUpGoogleUser(payload);
        const accessToken = logUserIn({ user, res });
        return accessToken;
      } catch (err) {
        handleResolverError(err);
      }
    },
    updateUser: async (_, args, { userInfo }) => {
      try {
        handleAuthentication(userInfo);
        if (userInfo.user.googleLogin)
          throw new ApolloError("Cannot update Google Login user account.");
        verifyUpdateUserInputFormat({ ...args });
        const updatedUser = await updateUser({
          userId: userInfo.userId,
          currentUser: userInfo.user,
          ...args
        });
        return escapeUserObject(updatedUser);
      } catch (err) {
        handleResolverError(err);
      }
    },
    forgottenPasswordEmail: async (_, { email }, { userInfo }) => {
      try {
        handleAuthenticationAlreadyLoggedIn(userInfo);
        verifyEmailFormat(email);
        const link = await createForgottenPasswordEmailLink(email);
        stanEmail.sendForgottenPasswordMail(email, link);
        return true;
      } catch (err) {
        handleResolverError(err);
      }
    },
    resetPassword: async (_, { userId, token, newPassword }, { userInfo }) => {
      try {
        handleAuthenticationAlreadyLoggedIn(userInfo);

        const user = await User.findOne({ _id: userId });
        if (!user) throw new ApolloError("There is no user with that id.");
        const secret = createForgottenPasswordSecret(user);

        validateForgottenPasswordToken(user, token, secret);

        const passwordToSave = await bcrypt.hash(newPassword, 10);
        const updateResp = await User.updateOne(
          { _id: user._id },
          { password: passwordToSave, updatedAt: new Date() }
        );
        if (updateResp.ok === 0 && updateResp.nModified === 0)
          throw new ApolloError("Unable to reset the password. Please try again.");
        return true;
      } catch (err) {
        handleResolverError(err);
      }
    },
    deleteUser: async (_, __, { res, userInfo }) => {
      try {
        handleAuthentication(userInfo);
        await deleteUsersData(userInfo.userId);
        sendRefreshToken(res, "");
        await deleteUser(userInfo.userId);
        if (userInfo.user.allowEmailNotifications)
          stanEmail.sendDeleteAccountMail(userInfo.user.email, userInfo.user.mascot);
        return true;
      } catch (err) {
        handleResolverError(err);
      }
    }
  }
};
