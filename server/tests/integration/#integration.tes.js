// //https://www.apollographql.com/docs/apollo-server/testing/testing/
// const { createTestClient } = require("apollo-server-testing");
// import { typeDefs } from "../../typedefs";
// import { resolvers } from "../../resolvers";

// // const { query, mutate } = createTestClient(server);

// // query({
// //   query: GET_USER,
// //   variables: { id: 1 }
// // });

// // mutate({
// //   mutation: UPDATE_USER,
// //   variables: { id: 1, email: "nancy@foo.co" }
// // });
// // //

// // test("verifies string is formatted as an email", () => {
// //   expect(true).toBeTruthy();
// // });

// test("fetches single launch", () => {
//   expect(testing().tobeTruthy());
//   // const userAPI = new UserAPI({ store });
//   // const launchAPI = new LaunchAPI();

//   // create a test server to test against, using our production typeDefs,
//   // resolvers, and dataSources.
//   // const server = new ApolloServer({
//   //   typeDefs,
//   //   resolvers,
//   //   context: async ({ req, res }) => ({ req, res })
//   // });

//   // // mock the dataSource's underlying fetch methods
//   // launchAPI.get = jest.fn(() => [mockLaunchResponse]);
//   // userAPI.store = mockStore;
//   // userAPI.store.trips.findAll.mockReturnValueOnce([
//   //   { dataValues: { launchId: 1 } }
//   // ]);

//   // // use the test server to create a query function
//   // const { query } = createTestClient(server);

//   // // run query against the server and snapshot the output
//   // const res = await query({ query: GET_LAUNCH, variables: { id: 1 } });
//   // expect(res).toMatchSnapshot();
// });

// function testing() {
//   return true;
// }
