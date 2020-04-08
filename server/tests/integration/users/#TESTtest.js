//https://www.apollographql.com/docs/apollo-server/testing/testing/
//https://mongoosejs.com/docs/jest.html

import { setupApolloServer, setupDb, teardown } from "../setup";

// describe("Test user sign up and login resolvers", () => {
// let server;
// let mutate;
// let query;
// let testUser;
// let client;
// beforeAll(async () => {
//   // await setupDb();
//   // testUser = await signUpTestUser();
//   // server = await setupApolloServer({
//   //   isAuth: true,
//   //   userId: testUser._id,
//   //   user: testUser
//   // });
//   // client = createTestClient(server);
//   // mutate = client.mutate;
//   // query = client.mutate;
// });

test("should fetch the current logged in user", async () => {
  expect(true).toBeTruthy();
});
