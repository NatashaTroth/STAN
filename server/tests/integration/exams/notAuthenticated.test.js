//https://www.apollographql.com/docs/apollo-server/testing/testing/
//https://mongoosejs.com/docs/jest.html
import { createTestClient } from "apollo-server-testing";
import { setupApolloServer, setupDb, clearDatabase, teardown } from "../setup";

import {
  ADD_EXAM_MUTATION,
  UPDATE_CURRENT_PAGE_MUTATION
} from "../../mutations.js";
import {
  GET_EXAM_QUERY,
  GET_EXAMS_QUERY,
  GET_TODAYS_CHUNKS
} from "../../queries.js";

// import { createTestClient } from "apollo-server-integration-testing";

describe("Test user resolver regex", () => {
  let server;
  let mutate;
  let query;
  beforeAll(async () => {
    await setupDb();
    server = await setupApolloServer({ isAuth: false });
    let client = createTestClient(server);
    mutate = client.mutate;
    query = client.query;
  });

  afterEach(async () => {
    await clearDatabase();
  });

  afterAll(async () => {
    await teardown();
  });

  it("should not be able to add an exam", async () => {
    const resp = await mutate({
      query: ADD_EXAM_MUTATION,
      variables: {
        subject: "German",
        examDate: "2122-08-11",
        startDate: "2122-08-05",
        numberPages: 5,
        timePerPage: 5,
        startPage: 4,
        notes: "NOTES",
        pdfLink: "klsdjfs",
        completed: false
      }
    });
    expect(resp.data.addExam).toBeFalsy();
    expect(resp.errors[0].message).toEqual("Unauthorised");
  });

  it("should not be able to update the current page", async () => {
    const resp = await mutate({
      query: UPDATE_CURRENT_PAGE_MUTATION,
      variables: {
        examId: "testId",
        page: 5
      }
    });

    expect(resp.data.updateCurrentPage).toBeFalsy();
    expect(resp.errors[0].message).toEqual("Unauthorised");
  });

  it("should not be able to fetch an exam", async () => {
    const resp = await query({
      query: GET_EXAM_QUERY,
      variables: {
        id: "testId"
      }
    });
    expect(resp.data.exam).toBeFalsy();
    expect(resp.errors[0].message).toEqual("Unauthorised");
  });

  it("should not be able to fetch exams", async () => {
    const resp = await query({
      query: GET_EXAMS_QUERY
    });
    expect(resp.data.exams).toBeFalsy();
    expect(resp.errors[0].message).toEqual("Unauthorised");
  });

  it("should not be able to fetch todays chunks", async () => {
    const resp = await query({
      query: GET_TODAYS_CHUNKS
    });
    expect(resp.data).toBeFalsy();
    expect(resp.errors[0].message).toEqual("Unauthorised");
  });

  //TODO ADD NEWER RESOLVERS
});
