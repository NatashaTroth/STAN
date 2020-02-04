//TODO: EXTRACT ALL DATABASE LOGIC TO APOLLO DATASOURCE: https://www.apollographql.com/docs/tutorial/data-source/
const { User } = require("../models");
const { UserInputError } = require("apollo-server");
import uuid from "uuid/v4";

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
      // console.log(args.password);
      return User.create(args);
      // console.log("created user " + args)
    },
    logout: (parent, args, context) => context.logout(),
    login: async (parent, { email, password }, context) => {
      const { user } = await context.authenticate("graphql-local", {
        email,
        password
      });
      console.log("user... : " + user);

      await context.login(user);
      return { user };
    },
    signup: async (parent, { username, email, password, mascot }, context) => {
      let newUser = null;
      const userWithEmail = await User.find({ email: email }).exec();
      userWithEmail
        .then(async resp => {
          //TODO: REFACTOR WITH ES6
          if (resp.length > 0) {
            //TODO: ERROR HANDLING
            throw new UserInputError("User with email already exists", {
              invalidArgs: Object.keys({ username, email, password, mascot })
            });
          }
          newUser = {
            id: uuid(),
            username,
            email,
            password,
            mascot
          };
          console.log(newUser);
          //TODO BCRYPT
          User.create({ username, email, password, mascot });
          context.User.addUser(newUser);
          // console.log(context);
          await context.login(newUser);
        })
        .catch(e => {
          console.log(e.message);
        });

      return { user: newUser };
    }
  }
};

module.exports = {
  userResolvers
};
