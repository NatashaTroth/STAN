//TODO: EXTRACT ALL DATABASE LOGIC TO APOLLO DATASOURCE: https://www.apollographql.com/docs/tutorial/data-source/
const { User } = require("../models");
const { UserInputError } = require("apollo-server");
import uuid from "uuid/v4";
// import passport from "passport";
const bcrypt = require("bcrypt");
const passport = require("../config/#passport");
const jwt = require("jsonwebtoken");

//TODO: Authentication
const userResolvers = {
  Query: {
    users: (root, arg, context, info) => {
      return User.find({});
      // return fetchData()
    },
    user: (root, arg, context, info) => {
      return fetchOneData();
    },
    currentUser: (parent, args, context) => {
      // console.log("here:" + context.getUser());
      context.getUser();
    }
  },
  Mutation: {
    addUser: (root, args, context, info) => {
      return User.create(args);
    },
    login: async (parent, { email, password }, context) => {
      // const  = args;
      console.log("loggin in");
      // console.log("test " + email);
      const user = await User.findOne({ email: email });
      // console.log(JSON.stringify(user));
      //TODO: Error Handling
      if (!user) return null;
      // console.log("here1");
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) return null;

      console.log("test2");

      //TODO: save secret to env variable
      const refreshToken = jwt.sign({ userId: user.id }, "secretSaveToEnv", {
        expiresIn: "7d"
      });
      const accessToken = jwt.sign({ userId: user.id }, "secretSaveToEnv", {
        expiresIn: "15min"
      });

      //can also return in resolver?
      context.res.cookie("refresh-token", refreshToken, {
        maxAge: 60 * 60 * 24 * 7
      });
      context.res.cookie("access-token", accessToken, {
        maxAge: 60 * 15
      });
      console.log("user:");
      console.log(user);
      return { user };
      // console.log(context.res);
    },
    signup: async (parent, args, context) => {
      let newUser = null;
      const { username, email, password, mascot } = args;
      try {
        const userWithEmail = await User.findOne({ email: email });

        if (userWithEmail) {
          //TODO: ERROR HANDLING
          throw new UserInputError("User with email already exists", {
            invalidArgs: Object.keys(args)
          });
        }

        newUser = new User({
          username,
          email,
          password,
          mascot
        });

        //Hash Password - TODO: change
        bcrypt.genSalt(10, (err, salt) =>
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;

            newUser.password = hash;
            newUser
              .save()
              .then
              //redirect
              //COULD ALSO USE FLASH MESSAGE HERE (connect-flash)
              ()
              .catch(err => console.log(err));
          })
        );
      } catch (e) {
        console.error(e.message);
      }
      return { user: newUser };
    }
  }
};

module.exports = {
  userResolvers
};
