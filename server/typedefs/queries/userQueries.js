const { gql } = require("apollo-server");

//TODO - DON'T ALLOW CLIENT TO BE ABLE TO QUERY PASSWORD
const userQueries = gql`
  type Query {
    users: [User]!
    user(id: ID!): User
    currentUser: User
  }

  type Mutation {
    #TODO: delete addUser afterwards
    addUser(
      username: String!
      password: String!
      email: String!
      mascot: Int
    ): User
    signup(
      username: String!
      email: String!
      password: String!
      mascot: Int
    ): User
    logout: Boolean
    login(email: String!, password: String!): AuthData
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