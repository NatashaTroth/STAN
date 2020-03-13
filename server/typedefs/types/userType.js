import { gql } from "apollo-server";

//TODO - DON'T ALLOW CLIENT TO BE ABLE TO QUERY PASSWORD
const userType = gql`
  type User {
    id: ID!
    username: String!
    email: String!
    mascot: Int!
  }
  type AuthData {
    # userId: ID!
    user: User!
    accessToken: String!
    tokenExpiration: Int!
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
