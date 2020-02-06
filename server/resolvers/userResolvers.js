//TODO: EXTRACT ALL DATABASE LOGIC TO APOLLO DATASOURCE: https://www.apollographql.com/docs/tutorial/data-source/
import { User } from "../models";
import { UserInputError } from "apollo-server";
import { createAccessToken, createRefreshToken } from "../auth";
import { sendRefreshToken } from "../sendRefreshToken";
import bcrypt from "bcrypt";

//TODO: Authenticate Queries
const userResolvers = {
  Query: {
    users: (root, arg, { req, res }, info) => {
      if (!req.isAuth) throw new Error("Unauthorised");

      return User.find({});
      // return fetchData()
    },
    user: (root, arg, context, info) => {
      return fetchOneData();
    },
    currentUser: (parent, ars, context) => {
      return context.req.userId;
    }
  },
  Mutation: {
    addUser: (root, args, context, info) => {
      // if (!req.isAuth) throw new Error("Unauthorised");
      return User.create(args);
    },
    revokeRefreshTokensForUser: async (root, { userId }, context, info) => {
      //TODO! ERROR HANDLING NOT WORKING WHEN WRONG USERID
      const user = await User.findOne({ _id: userId });
      if (!user) throw new Error("This user does not exist");

      //TODO: error handling
      await User.updateOne({ _id: userId }, { $inc: { tokenVersion: 1 } });
      return true;
    },
    logout: (root, args, { res }, info) => {
      sendRefreshToken(res, "");
      return true;
    },
    login: async (parent, { email, password }, context) => {
      const user = await User.findOne({ email: email });
      //TODO: Error Handling
      // if (!user) return null;
      if (!user) throw new Error("User with this email does not exist");
      const valid = await bcrypt.compare(password, user.password);
      // if (!valid) return null;
      if (!valid) throw new Error("Password is incorrect");

      //TODO: save secret to env variable
      // const refreshToken = jwt.sign({ userId: user.id }, "secretSaveToEnv", {
      //   expiresIn: "7d"
      // });
      const accessToken = createAccessToken(user);
      //can also return in resolver?
      //TODO: NAME IT SOMETHING ELSE, SO NO ONE KNOWS ITS THE REFRESH-TOKEN
      sendRefreshToken(context.res, createRefreshToken(user));

      return { userId: user.id, accessToken: accessToken, tokenExpiration: 15 };
    },
    signup: async (
      parent,
      { username, email, password, mascot, tokenVersion },
      context
    ) => {
      const userWithEmail = await User.findOne({ email: email });

      if (userWithEmail) {
        //TODO: ERROR HANDLING
        throw new UserInputError("User with email already exists");
      }
      const hash = await bcrypt.hash(password, 10);

      return User.create({
        username,
        email,
        password: hash,
        mascot,
        tokenVersion
      });
    }
  }
};

module.exports = {
  userResolvers
};
