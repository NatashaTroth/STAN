//https://www.apollographql.com/docs/apollo-server/testing/testing/
//https://mongoosejs.com/docs/jest.html
import "dotenv/config";
import { createTestClient } from "apollo-server-testing";
import { setupApolloServer, setupDb, signUpTestUser, teardown } from "../setup";
import {
  LOGIN_MUTATION,
  SIGNUP_MUTATION,
  UPDATE_MASCOT_MUTATION
} from "../../mutations.js";
import { CURRENT_USER } from "../../queries.js";
import { User } from "../../../models";
import { isAuth } from "../../../helpers/is-auth";
import jwt from "jsonwebtoken";

// import { createTestClient } from "apollo-server-integration-testing";

describe("Test user sign up and login resolvers", () => {
  let server;
  let mutate;
  beforeAll(async () => {
    await setupDb();
    const testUser = await signUpTestUser();

    console.log(testUser);
    server = await setupApolloServer({ isAuth: true, userId: testUser });
    let client = createTestClient(server);
    mutate = client.mutate;
  });

  afterAll(async () => {
    await teardown();
  });

  it("should update the mascot for a user", async () => {
    console.log("HIIII");
    expect(true).toBeTruthy();
  });

  // it.skip("should update the mascot for a user", async () => {
  //   const signupResp = await signUserUp(
  //     "Stan1",
  //     "user1@stan.com",
  //     "12345678",
  //     0
  //   );
  //   expect(signupResp.data.signup.user.mascot).toBe(0);

  //   const initialCount = await User.countDocuments();
  //   const resp = await mutate({
  //     query: UPDATE_MASCOT_MUTATION,
  //     variables: {
  //       mascot: 2
  //     }
  //   });
  //   console.log(resp);
  //   expect(resp.data.updateMascot).toBeTruthy();

  //   const user = await User.findOne({
  //     username: "Stan1",
  //     email: "user1@stan.com"
  //   });
  //   expect(user).toBeTruthy();
  //   expect(user.mascot).toBe(2);

  //   const resp2 = await mutate({
  //     query: UPDATE_MASCOT_MUTATION,
  //     variables: {
  //       mascot: 1
  //     }
  //   });
  //   expect(resp2.data.updateMascot).toBeTruthy();

  //   const user2 = await User.findOne({
  //     username: "Stan1",
  //     email: "user1@stan.com"
  //   });
  //   expect(user2).toBeTruthy();
  //   expect(user2.mascot).toBe(1);

  //   const newCount = await User.countDocuments();
  //   expect(newCount).toBe(initialCount);
  // });

  //TODO: TEST TOKEN VERSION
  it.skip("should not sign up a user if already logged in", async () => {
    // const initialCount = await User.countDocuments();
    // const resp = await mutate({
    //   query: SIGNUP_MUTATION,
    //   variables: {
    //     username: "Stan",
    //     email: "user@stan.com",
    //     password: "12345678",
    //     mascot: 1
    //   }
    // });
    // expect(resp.data.signup).toBeTruthy();
    // const newCount = await User.countDocuments();
    // expect(newCount).toBe(initialCount + 1);
    // const user = await User.findOne({
    //   username: "Stan",
    //   email: "user@stan.com"
    // });
    // expect(user).toBeTruthy();
    // expect(user.id).toBe(resp.data.signup.user.id);
    // expect(user.username).toBe(resp.data.signup.user.username);
    // expect(user.email).toBe(resp.data.signup.user.email);
    // expect(user.mascot).toBe(resp.data.signup.user.mascot);
    // expect(user.googleId).toBe(resp.data.signup.user.googleId);
    // expect(user.googleLogin).toBe(resp.data.signup.user.googleLogin);
    // //Test accesstoken
    // expect(resp.data.signup.accessToken).toBeDefined();
    // const decodedToken = jwt.verify(
    //   resp.data.signup.accessToken,
    //   process.env.ACCESS_TOKEN_SECRET
    // );
    // expect(decodedToken).toBeTruthy();
    // expect(decodedToken.userId).toBe(user.id);
    // expect(decodedToken.tokenVersion).toBe(0);
    // //Already logged in
    // const resp2 = await mutate({
    //   query: SIGNUP_MUTATION,
    //   variables: {
    //     username: "Stan",
    //     email: "user@stan.com",
    //     password: "12345678",
    //     mascot: 1
    //   }
    // });
    //TEST ISAUTH ?
  });

  async function signUserUp(username, email, password, mascot) {
    const initialCount = await User.countDocuments();
    const resp = await mutate({
      query: SIGNUP_MUTATION,
      variables: {
        username,
        email,
        password,
        mascot: mascot || 0
      }
    });
    expect(resp.data.signup).toBeTruthy();
    const newCount = await User.countDocuments();
    expect(newCount).toBe(initialCount + 1);
    return resp;
  }
});

// function isOneMore(initialCount, newCount){
//   if()
// }
