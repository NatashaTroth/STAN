const NodeEnvironment = require("jest-environment-node");
const { createTestClient } = require("apollo-server-testing");
const { typeDefs } = require("../../typedefs");
const { resolvers } = require("../../resolvers");
const { ApolloServer } = require("apollo-server-express");
const { MongoClient } = require("mongodb");
const mongoose = require("mongoose");
const { User } = require("../../models");
//TODO: make connection string dynamic
class StanEnvironment extends NodeEnvironment {
  constructor(config, context) {
    super(config, context);
    this.testPath = context.testPath;
    this.docblockPragmas = context.docblockPragmas;
    // this.connection = "";
    // this.test = "hiii";
    // this.db = "";
    this.connectionString = "mongodb://localhost/testMMP3";
    // this.global.server = "";
  }

  async setup() {
    await super.setup();
    console.log("IN SETUP");
    // await someSetupTasks(this.testPath);
    // this.global.someGlobalObject = createGlobalObject();

    this.global.server = new ApolloServer({
      typeDefs,
      resolvers,
      context: async ({ req, res }) => ({ req, res })
    });
    console.log("done server " + this.global.server);
    mongoose
      .connect(this.connectionString, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
      })
      .then(dbConnection => {
        // this.global.db = dbConnection;
        console.log("connected to db");
        // console.log(JSON.stringify(mongoose));
      })
      .catch(e => {
        console.error(e.message);
        //TODO CHANGE TO TEST
        throw new Error("db not connected");
      });

    // // Will trigger if docblock contains @my-custom-pragma my-pragma-value
    // if (this.docblockPragmas["my-custom-pragma"] === "my-pragma-value") {
    //   // ...
    // }
  }

  async teardown() {
    // this.global.someGlobalObject = destroyGlobalObject();
    // await someTeardownTasks();
    await mongoose.connection.dropDatabase();
    // await db.users.drop();
    console.log("end1");
    // await this.global.db.disconnect();
    await mongoose.connection.close();
    // await mongoose.connection.disconnect();
    console.log("closed");
    await super.teardown();
  }

  runScript(script) {
    return super.runScript(script);
  }

  // handleTestEvent(event, state) {
  //   if (event.name === "test_start") {
  //     // ...
  //   }
  // }
}

module.exports = StanEnvironment;
