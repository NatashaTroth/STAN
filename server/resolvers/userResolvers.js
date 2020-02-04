//TODO: EXTRACT ALL DATABASE LOGIC TO APOLLO DATASOURCE: https://www.apollographql.com/docs/tutorial/data-source/
const { User } = require("../models");

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
    currentUser: (parent, args, context) => context.getUser()
  },
  Mutation: {
    addUser: (root, args, context, info) => {
      console.log(args.password);
      return User.create(args);
      // console.log("created user " + args)
    },
    logout: (parent, args, context) => context.logout(),
    login: async (parent, { email, password }, context) => {
      const { user } = await context.authenticate("graphql-local", {
        email,
        password
      });
      await context.login(user);
      return { user };
    }
  }
};

module.exports = {
  userResolvers
};
