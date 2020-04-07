//https://www.apollographql.com/docs/apollo-server/testing/testing/
//https://mongoosejs.com/docs/jest.html
import "dotenv/config";
import { createTestClient } from "apollo-server-testing";
import { setup, teardown } from "../setup";
import { LOGIN_MUTATION, SIGNUP_MUTATION } from "../../mutations.js";

// import { createTestClient } from "apollo-server-integration-testing";

describe("Test user resolver regex", () => {
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

  it("should pass the regex tests and sign up a user", async () => {
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
  });

  it("should use regex to filter out wrong username format", async () => {
    const resp = await mutate({
      query: SIGNUP_MUTATION,
      variables: {
        username: "",
        email: "user2@stan.com",
        password: "12345678",
        mascot: 1
      }
    });
    expect(resp.data.signup).toBeFalsy();
    expect(resp.errors[0].message).toEqual(
      "Username input has the wrong format"
    );
  });

  it("should use regex to filter out wrong email format", async () => {
    const resp = await mutate({
      query: SIGNUP_MUTATION,
      variables: {
        username: "Stan",
        email: "userstan.com",
        password: "12345678",
        mascot: 1
      }
    });
    expect(resp.data.signup).toBeFalsy();
    expect(resp.errors[0].message).toEqual("Email input has the wrong format");
  });

  it("should use regex to filter out wrong email format", async () => {
    const resp = await mutate({
      query: SIGNUP_MUTATION,
      variables: {
        username: "Stan",
        email: "",
        password: "12345678",
        mascot: 1
      }
    });
    expect(resp.data.signup).toBeFalsy();
    expect(resp.errors[0].message).toEqual("Email input has the wrong format");
  });

  it("should use regex to filter out wrong email format", async () => {
    const resp = await mutate({
      query: SIGNUP_MUTATION,
      variables: {
        username: "Stan",
        email: "A@b@c@stan.com",
        password: "12345678",
        mascot: 1
      }
    });
    expect(resp.data.signup).toBeFalsy();
    expect(resp.errors[0].message).toEqual("Email input has the wrong format");
  });

  it("should use regex to filter out wrong password format", async () => {
    const resp = await mutate({
      query: SIGNUP_MUTATION,
      variables: {
        username: "Stan",
        email: "user3@stan.com",
        password: "",
        mascot: 1
      }
    });
    expect(resp.data.signup).toBeFalsy();
    expect(resp.errors[0].message).toEqual(
      "Password input has the wrong format"
    );
  });

  it("should pass the regex tests and login a user", async () => {
    const resp = await mutate({
      query: LOGIN_MUTATION,
      variables: {
        email: "user@stan.com",
        password: "12345678"
      }
    });
    expect(resp.data.login).toBeTruthy();
  });

  it("should use regex to filter out wrong email format", async () => {
    const resp = await mutate({
      query: LOGIN_MUTATION,
      variables: {
        email: "userstan.com",
        password: "12345678"
      }
    });
    expect(resp.data.login).toBeFalsy();
    expect(resp.errors[0].message).toEqual("Email input has the wrong format");
  });

  it("should use regex to filter out wrong email format", async () => {
    const resp = await mutate({
      query: LOGIN_MUTATION,
      variables: {
        email: "",
        password: "12345678"
      }
    });
    expect(resp.data.login).toBeFalsy();
    expect(resp.errors[0].message).toEqual("Email input has the wrong format");
  });

  it("should use regex to filter out wrong password format", async () => {
    const resp = await mutate({
      query: LOGIN_MUTATION,
      variables: {
        email: "user@stan.com",
        password: "1234567"
      }
    });
    expect(resp.data.login).toBeFalsy();
    expect(resp.errors[0].message).toEqual(
      "Password input has the wrong format"
    );
  });

  it("should use regex to filter out wrong password format", async () => {
    const resp = await mutate({
      query: LOGIN_MUTATION,
      variables: {
        email: "user@stan.com",
        password: ""
      }
    });
    expect(resp.data.login).toBeFalsy();
    expect(resp.errors[0].message).toEqual(
      "Password input has the wrong format"
    );
  });
});
