//TODO: EXTRACT ALL DATABASE LOGIC TO APOLLO DATASOURCE: https://www.apollographql.com/docs/tutorial/data-source/
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

//TODO: Authenticate Queries
const userResolvers = {
  Query: {
    users: (root, arg, { req, res }, info) => {
      // if (!req.isAuth) throw new Error("Unauthorised");
      return User.find({});
    },
    user: (root, arg, context, info) => {
      return fetchOneData();
    },
    currentUser: (parent, ars, context) => {
      // if (!req.isAuth) throw new Error("Unauthorised");
      // fetch header
      const authorization = context.req.get("authorization");
      if (!authorization) return null;
      try {
        //TODO: SAVE ALL PAYLOAD
        const token = authorization.split(" ")[1];
        const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        return User.findOne({ _id: payload.userId });
      } catch (err) {
        console.error(err.message);
        return null;
      }
    }
  },
  Mutation: {
    //TODO: don't make this available to users - DELETE THIS MUTATION - the revoke code should be used in a method, say if password forgotton / change password or user account hacked - closes all open sessions
    // revokeRefreshTokensForUser: async (root, { userId }, context, info) => {
    //   try {
    //     const user = await User.findOne({ _id: userId });
    //     if (!user) throw new AuthenticationError("This user does not exist");
    //     await User.updateOne({ _id: userId }, { $inc: { tokenVersion: 1 } });
    //     return true;
    //   } catch (err) {
    //     if (err.extensions.code !== "UNAUTHENTICATED")
    //       throw new ApolloError(err.message);
    //     throw err;
    //   }
    // },
    logout: (root, args, { res }, info) => {
      sendRefreshToken(res, "");
      return true;
    },
    login: async (parent, { email, password }, context) => {
      try {
        const user = authenticateUser({ email, password });
        const accessToken = logUserIn({ user, context });
        return { user: user, accessToken: accessToken, tokenExpiration: 15 };
      } catch (err) {
        if (err.extensions.code && err.extensions.code !== "UNAUTHENTICATED")
          throw new AuthenticationError(err.message);
        throw err;
      }
    },
    signup: async (parent, { username, email, password, mascot }, context) => {
      try {
        const user = signUserUp({ username, email, password, mascot });
        const accessToken = logUserIn({ user, context });
        return { user: user, accessToken: accessToken, tokenExpiration: 15 };
      } catch (err) {
        if (err.extensions.code && err.extensions.code !== "UNAUTHENTICATED")
          throw new AuthenticationError(err.message);
        throw err;
      }
    }
  }
};

async function authenticateUser({ email, password }) {
  const user = await User.findOne({ email: email });
  if (!user)
    throw new AuthenticationError("User with this email does not exist");

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new AuthenticationError("Password is incorrect");
  return user;
}

async function signUserUp({ username, email, password, mascot }) {
  const userWithEmail = await User.findOne({ email: email });
  if (userWithEmail) throw new UserInputError("User with email already exists");
  const hashedPassword = await bcrypt.hash(password, 10);
  const resp = await User.create({
    username,
    email,
    password: hashedPassword,
    mascot
  });
  if (!resp) throw new AuthenticationError("User could not be created");
  return resp;
}

function logUserIn({ user, context }) {
  let userAccessToken = createAccessToken(user);
  //TODO: NAME IT SOMETHING ELSE, SO NO ONE KNOWS ITS THE REFRESH-TOKEN?
  sendRefreshToken(context.res, createRefreshToken(user));

  return userAccessToken;
}

module.exports = {
  userResolvers
};
