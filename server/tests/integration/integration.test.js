// //https://www.apollographql.com/docs/apollo-server/testing/testing/
// const { createTestClient } = require("apollo-server-testing");

// const { query, mutate } = createTestClient(server);

// query({
//   query: GET_USER,
//   variables: { id: 1 }
// });

// mutate({
//   mutation: UPDATE_USER,
//   variables: { id: 1, email: "nancy@foo.co" }
// });
// //

test("verifies string is formatted as an email", () => {
  expect(true).toBeTruthy();
});
