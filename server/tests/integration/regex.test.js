//https://www.apollographql.com/docs/apollo-server/testing/testing/
const { createTestClient } = require("apollo-server-testing");
import { typeDefs } from "../../typedefs";
import { resolvers } from "../../resolvers";

test("fetches single launch", () => {
  function testing() {
    return true;
  }
  expect("n@f.at").toBeTruthy();
});
