const { userResolvers } = require("./userResolvers");
const { examResolvers } = require("./examResolvers");
const resolvers = [userResolvers, examResolvers];

module.exports = {
  resolvers
};
