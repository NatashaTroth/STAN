import { createTestClient } from "apollo-server-testing";
import { typeDefs } from "../../typedefs";
import { resolvers } from "../../resolvers";
import { ApolloServer } from "apollo-server-express";
const { MongoClient } = require("mongodb");
import mongoose from "mongoose";
import { User } from "../../models";

class testSetup {
  constructor() {
    // Constructor
    // this.carname = brand;
  }

  async setup() {}
}
