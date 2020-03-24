//https://www.apollographql.com/docs/apollo-server/testing/testing/
//https://mongoosejs.com/docs/jest.html
import { createTestClient } from "apollo-server-testing";
import { typeDefs } from "../../typedefs";
import { resolvers } from "../../resolvers";
import { ApolloServer } from "apollo-server-express";
const { MongoClient } = require("mongodb");

describe("??", () => {
  // const userAPI = new UserAPI({ store });
  // const launchAPI = new LaunchAPI();

  // create a test server to test against, using our production typeDefs,
  // resolvers, and dataSources.

  //TODO: EXTRACT MONGODB CONNECTIONS
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req, res }) => ({ req, res })
  });

  const connectionString = "mongodb://localhost/testMMP3";
  let connection;
  let db;

  beforeAll(async () => {
    try {
      connection = await MongoClient.connect(connectionString, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
      db = await connection.db("testMMP3");
    } catch (err) {
      //TODO CHANGE TO TEST
      throw new Error("db not connected");
    }
  });

  afterAll(async () => {
    await db.dropDatabase();
    // await db.users.drop();
    await connection.close();
    await db.close();
  });

  it("should insert a doc into collection", async () => {
    const users = db.collection("users");

    const conso = { name: "John1" };
    await users.insertOne(conso);

    const insertedUser = await users.findOne({ name: "John1" });
    expect(insertedUser).toEqual(conso);
    // expect("ksjhdf").toBeTruthy();
  });
  // use the test server to create a query function
  const { query } = createTestClient(server);

  // // run query against the server and snapshot the output
  // const res = await query({ query: GET_LAUNCH, variables: { id: 1 } });
  // expect(res).toMatchSnapshot();
});
