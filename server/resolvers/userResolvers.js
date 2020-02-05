//TODO: EXTRACT ALL DATABASE LOGIC TO APOLLO DATASOURCE: https://www.apollographql.com/docs/tutorial/data-source/
const { User } = require("../models");
const { UserInputError } = require("apollo-server");
import uuid from "uuid/v4";
import { createAccessToken, createRefreshToken } from "../auth";
import { sendRefreshToken } from "../sendRefreshToken";

// import passport from "passport";
const bcrypt = require("bcrypt");
// const passport = require("../config/#passport");
const jwt = require("jsonwebtoken");

//TODO: Authentication
const userResolvers = {
  Query: {
    users: (root, arg, { req, res }, info) => {
      return User.find({});
      // return fetchData()
    },
    user: (root, arg, context, info) => {
      return fetchOneData();
    },
    currentUser: (parent, args, context) => {
      // console.log("here:" + context.getUser());
      return context.req.userId;
    }
  },
  Mutation: {
    addUser: (root, args, context, info) => {
      // if (!req.isAuth) throw new Error("Unauthorised");
      return User.create(args);
    },
    revokeRefreshTokensForUser: (root, { userId }, context, info) => {
      //TODO: change to async await (find way for error handling)
      User.findOneAndUpdate(
        { _id: context.req.userId },
        { $inc: { tokenVersion: 1 } },
        { new: true },
        (err, doc) => {
          if (err) {
            return false;
          }
        }
      );
      return true;

      // findOneAndUpdate({ _id: res._id }, { $inc: {'post.like': 1 } }, {new: true },function(err, response) {
      //   if (err) {
      //   callback(err);
      //  } else {
      //   callback(response);
      //  }
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

      console.log("user:");
      console.log(user);
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

      console.log(hash);
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
