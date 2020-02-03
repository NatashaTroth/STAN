// const { userType, examType } = require("./types");
const { types } = require("./types");
const { queries } = require("./queries");
const { gql } = require("apollo-server");
const { mergeTypes } = require("merge-graphql-schemas");

const typeDefs = gql`
  ${mergeTypes([...types, ...queries])}
`;

module.exports = {
  typeDefs
};
