import { gql } from "apollo-server";

//TODO - DON'T ALLOW CLIENT TO BE ABLE TO QUERY CONFIDENTIAL DATA
const userQueries = gql`
  type Query {
    users: [User]!
    user(id: ID!): User
    currentUser: User
    currentUserState: Int
  }

  type Mutation {
    #TODO: delete addUser afterwards
    addUser(
      username: String!
      password: String
      email: String!
      mascot: Int
    ): User
    signup(
      username: String!
      email: String!
      password: String
      mascot: Int
      googleLogin: Boolean
    ): String!
    logout: Boolean
    login(email: String!, password: String): String!
    googleLogin(idToken: String!): String!

    updateUser(
      username: String!
      email: String!
      password: String
      newPassword: String
      mascot: Int!
    ): User!

    updateMascot(mascot: Int!): Boolean
    deleteUser: Boolean
    #in case refresh tokens get comprimised
    # revokeRefreshTokensForUser(userId: ID!): Boolean
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
