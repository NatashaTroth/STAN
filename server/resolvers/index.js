const { userResolvers } = require("./userResolvers");
const { examResolvers } = require("./examResolvers");
// import { userResolvers } from "./userResolvers";
// import { examResolvers } from "./examResolvers";
// const resolvers = [userResolvers, examResolvers];
const resolvers = [userResolvers, examResolvers];

module.exports = {
  resolvers
};
