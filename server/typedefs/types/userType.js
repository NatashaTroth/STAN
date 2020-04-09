const { gql } = require("apollo-server");

//TODO - DON'T ALLOW CLIENT TO BE ABLE TO QUERY PASSWORD
const userType = gql`
  type User {
    id: ID!
    googleId: String
    username: String!
    email: String!
    mascot: Int!
    googleLogin: Boolean
  }
  # type AuthData {
  #   # userId: ID!
  #   user: User!
  #   accessToken: String!
  #   tokenExpiration: Int!
  # }
  type UpdateUserResponse {
    successful: Boolean!
    user: User!
  }
`;

module.exports = { userType };

// type Mutation {
//   addUser(id: [ID]!): UserUpdateResponse!
//   deleteUser(id: ID!): UserUpdateResponse!
//   login(email: String): String # login token
// }
// type UserUpdateResponse {
//   success: Boolean!
//   message: String
// }
