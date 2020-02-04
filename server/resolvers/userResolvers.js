//TODO: EXTRACT ALL DATABASE LOGIC TO APOLLO DATASOURCE: https://www.apollographql.com/docs/tutorial/data-source/
const { User } = require("../models");
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
      const existingUsers = context.User.getUsers();
      //!! converts to true boolean - so returns boolean
      //it's a horribly obscure way to do a type conversion.
      //TODO: change
      const userWithEmailAlreadyExists = !!existingUsers.find(
        user => user.email === email
      );

      if (userWithEmailAlreadyExists) {
        throw new Error("User with email already exists");
      }

      const newUser = {
        id: uuid(),
        username,
        email,
        password,
        mascot
      };

      context.User.addUser(newUser);

      await context.login(newUser);

      return { user: newUser };
    }
  }
};

module.exports = {
  userResolvers
};
