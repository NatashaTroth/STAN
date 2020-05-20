import { gql } from "apollo-server";

//TODO - DON'T ALLOW CLIENT TO BE ABLE TO QUERY PASSWORD
const userType = gql`
  type User {
    id: ID!
    googleId: String
    username: String!
    email: String!
    mascot: Int!
    googleLogin: Boolean!
    allowEmailNotifications: Boolean!
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
