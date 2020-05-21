//TODO: EXTRACT ALL DATABASE LOGIC TO APOLLO DATASOURCE: https://www.apollographql.com/docs/tutorial/data-source/

import { User } from "../models";
import {
  // UserInputError,
  AuthenticationError,
  ApolloError
} from "apollo-server";
import {
  sendRefreshToken,
  createLoginTokens
} from "../helpers/authentication/authenticationTokens";
import {
  handleResolverError,
  handleAuthentication,
  handleAuthenticationAlreadyLoggedIn
} from "../helpers/generalHelpers";
import bcrypt from "bcrypt";

import { escapeUserObject, updateUserLastVisited } from "../helpers/users/userHelpers";
import { updateUser, handleUpdateMascot } from "../helpers/users/updateUser";
import {
  createForgottenPasswordEmailLink,
  createForgottenPasswordSecret,
  validateForgottenPasswordToken,
  updatePassword
} from "../helpers/users/forgottenResetPassword";
import {
  verifySignupInputFormat,
  verifyMascotInputFormat,
  verifyUpdateUserInputFormat,
  verifyEmailFormat
} from "../helpers/users/validateUserInput";
import { deleteUsersData, deleteUser } from "../helpers/users/deleteUser";
import { signUserUp, signUpGoogleUser, handleSignUp } from "../helpers/users/signup";
import { verifyGoogleIdToken, handleLogin } from "../helpers/users/login";
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
    login: async (_, args, { res, userInfo }) => {
      try {
        handleAuthenticationAlreadyLoggedIn(userInfo);
        return await handleLogin({ ...args }, res);
      } catch (err) {
        handleResolverError(err);
      }
    },
    signup: async (_, args, { res, userInfo }) => {
      try {
        handleAuthenticationAlreadyLoggedIn(userInfo);
        return handleSignUp(args, res);
      } catch (err) {
        handleResolverError(err);
      }
    },
    updateMascot: async (_, { mascot }, { userInfo }) => {
      try {
        handleAuthentication(userInfo);
        await handleUpdateMascot(mascot, userInfo);
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
        const accessToken = createLoginTokens({ user, res });
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
        // handleResetPassword(args, userInfo)
        const user = await User.findOne({ _id: userId });
        if (!user) throw new ApolloError("There is no user with that id.");
        const secret = createForgottenPasswordSecret(user);
        validateForgottenPasswordToken(user, token, secret);
        const passwordToSave = await bcrypt.hash(newPassword, 10);
        await updatePassword(user._id, passwordToSave);
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
