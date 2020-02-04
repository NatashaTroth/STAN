const { gql } = require("apollo-server");

//TODO - DON'T ALLOW CLIENT TO BE ABLE TO QUERY PASSWORD
const userQueries = gql`
  type Query {
    users: [User]!
    user(id: ID!): User
  }

  type Mutation {
    addUser(
      username: String!
      password: String!
      email: String!
      mascot: Int
    ): User
  }
`;

module.exports = { userQueries };

// type Mutation {
//   addUser(id: [ID]!): UserUpdateResponse!
//   deleteUser(id: ID!): UserUpdateResponse!
//   login(email: String): String # login token
// }
// type UserUpdateResponse {
//   success: Boolean!
//   message: String
// }
