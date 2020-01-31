const { gql } = require('apollo-server');


//TODO - DON'T ALLOW CLIENT TO BE ABLE TO QUERY PASSWORD
//TODO: extract each type of query (user & exams) into own files
const typeDefs = gql`

type User {
  id: ID!
  username: String!
  password: String!
  email: String!
  photoLink: String
  mascot: Int!
}

scalar Date

type MyType {
   created: Date
}

type Exam {
  id: ID!,
  subject: String!,
  examDate: Date!,
  startDate: Date,
  numberPages: Int,
  timePerPage: Int,
  timesRepeat: Int,
  currentPage: Int,
  notes: String,
  pdfLink: String,
  completed: Boolean,
  user: User!    
}


type Query {
  users: [User]!
  user(id: ID!): User
  exams: [Exam]!
  exam(id: ID!): Exam

}
type Mutation {
  addUser(username: String!, 
  password: String!, 
  email: String!, 
  photoLink: String, 
  mascot: Int): User

  addExam( subject: String!,
  examDate: Date!,
  startDate: Date,
  numberPages: Int,
  timePerPage: Int,
  timesRepeat: Int,
  currentPage: Int,
  notes: String,
  pdfLink: String,
  completed: Boolean,
  userId: ID! ) : Exam

}


`;

module.exports = typeDefs;


// type Mutation {
//   addUser(id: [ID]!): UserUpdateResponse!
//   deleteUser(id: ID!): UserUpdateResponse!
//   login(email: String): String # login token
// }
// type UserUpdateResponse {
//   success: Boolean!
//   message: String
// }