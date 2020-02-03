const { userResolvers } = require("./userResolvers");
// const { examResolvers } = require("./examResolvers");
// const resolvers = [userResolvers, examResolvers];
const resolvers = [userResolvers];

module.exports = {
  resolvers
};
