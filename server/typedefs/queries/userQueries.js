import { gql } from "apollo-server";
//  TODO: CHECK WHAT IS REQUIRED AND WHAT ISN't
//TODO - DON'T ALLOW CLIENT TO BE ABLE TO QUERY CONFIDENTIAL DATA
const userQueries = gql`
  type Query {
    currentUser: User
    # currentUserState: String!
  }

  type Mutation {
    signup(
      username: String!
      email: String!
      password: String
      mascot: Int
      # googleLogin: Boolean
      allowEmailNotifications: Boolean!
    ): String!
    logout: Boolean
    login(email: String!, password: String): String!
    googleLogin(idToken: String!): String!
    forgottenPasswordEmail(email: String!): Boolean!

    resetPassword(
      userId: String!
      token: String!
      newPassword: String!
    ): Boolean!
    updateUser(
      username: String!
      email: String!
      password: String
      newPassword: String
      mascot: Int!
      allowEmailNotifications: Boolean!
    ): User!

    updateMascot(mascot: Int!): Boolean
    deleteUser: Boolean

    #in case refresh tokens get comprimised
    # revokeRefreshTokensForUser(userId: ID!): Boolean
  }
`;

module.exports = { userQueries };
