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
    }
  },
  Mutation: {
    addUser: (root, args, context, info) => {
      return User.create(args);
      // console.log("created user " + args)
    }
  }
};

module.exports = {
  userResolvers
};
