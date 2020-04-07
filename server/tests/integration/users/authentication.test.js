//https://www.apollographql.com/docs/apollo-server/testing/testing/
//https://mongoosejs.com/docs/jest.html
import "dotenv/config";
import { createTestClient } from "apollo-server-testing";
import { setup, teardown } from "../setup";
import { LOGIN_MUTATION, SIGNUP_MUTATION } from "../../mutations.js";
import { User } from "../../../models";

// import { createTestClient } from "apollo-server-integration-testing";

describe("Test user sign up and login resolvers", () => {
  let server;
  let mutate;
  beforeAll(async () => {
    server = await setup({ isAuth: false });
    let client = createTestClient(server);
    mutate = client.mutate;
  });

  afterAll(async () => {
    await teardown();
  });

  it("should sign up a user", async () => {
    const initialCount = await User.countDocuments();
    const resp = await mutate({
      query: SIGNUP_MUTATION,
      variables: {
        username: "Stan",
        email: "user@stan.com",
        password: "12345678",
        mascot: 1
      }
    });
    expect(resp.data.signup).toBeTruthy();

    const newCount = await User.countDocuments();
    expect(newCount).toBe(initialCount + 1);

    const user = await User.findOne({
      username: "Stan",
      email: "user@stan.com"
    });
    expect(user).toBeTruthy();
    console.log(JSON.stringify(user));
    // console.log(JSON.stringify(resp.data.signup.user.id));
    expect(user.id).toBe(resp.data.signup.user.id);
    expect(user.username).toBe(resp.data.signup.user.username);
    expect(user.email).toBe(resp.data.signup.user.email);
    expect(user.username).toBe(resp.data.signup.user.username);
    expect(user.username).toBe(resp.data.signup.user.username);
    expect(user.username).toBe(resp.data.signup.user.username);
  });
});

// function isOneMore(initialCount, newCount){
//   if()
// }
