//https://www.apollographql.com/docs/apollo-server/testing/testing/
//https://mongoosejs.com/docs/jest.html
import { createTestClient } from "apollo-server-testing";
import { setupApolloServer, setupDb, clearDatabase, teardown } from "../setup";

import { ADD_EXAM_MUTATION } from "../../mutations.js";

// import { createTestClient } from "apollo-server-integration-testing";

describe("Test user resolver regex", () => {
  let server;
  let mutate;
  beforeAll(async () => {
    await setupDb();
    server = await setupApolloServer({ isAuth: true, userId: "testUserId" });
    let client = createTestClient(server);
    mutate = client.mutate;
  });

  afterEach(async () => {
    await clearDatabase();
  });

  afterAll(async () => {
    await teardown();
  });

  it("should add an exam", async () => {
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
    expect(resp.data.addExam).toBeTruthy();

    const resp2 = await mutate({
      query: ADD_EXAM_MUTATION,
      variables: {
        subject: "German",
        examDate: "2122-08-06",
        startDate: "2122-08-05",
        numberPages: 5,
        timePerPage: 5,
        startPage: 4,
        notes: "NOTES",
        pdfLink: "klsdjfs",
        completed: false
      }
    });
    expect(resp2.data.addExam).toBeTruthy();

    const resp3 = await mutate({
      query: ADD_EXAM_MUTATION,
      variables: {
        subject: "German",
        examDate: new Date("2122-08-06"),
        startDate: "2122-08-05",
        numberPages: 5,
        timePerPage: 5,
        startPage: 4,
        notes: "NOTES",
        pdfLink: "klsdjfs",
        completed: false
      }
    });
    expect(resp3.data.addExam).toBeTruthy();
  });

  it("should not add an exam, since start date is after exam date", async () => {
    const resp = await mutate({
      query: ADD_EXAM_MUTATION,
      variables: {
        subject: "German",
        examDate: "2122-08-05",
        startDate: "2122-08-11",
        numberPages: 5,
        timePerPage: 5,
        startPage: 4,
        notes: "NOTES",
        pdfLink: "klsdjfs",
        completed: false
      }
    });
    expect(resp.data.addExam).toBeFalsy();
    expect(resp.errors[0].message).toEqual(
      "Dates cannot be in the past and start learning date must be before exam date."
    );
  });

  it("should not add an exam, since start date is the same as exam date", async () => {
    const resp = await mutate({
      query: ADD_EXAM_MUTATION,
      variables: {
        subject: "German",
        examDate: "2122-08-05",
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
    expect(resp.errors[0].message).toEqual(
      "Careful! You shouldn't start learning on the same day as the test. Start date should be at least 1 day before the test."
    );
  });

  it("should not add an exam, since dates are in the past", async () => {
    const resp = await mutate({
      query: ADD_EXAM_MUTATION,
      variables: {
        subject: "German",
        examDate: "1922-08-05",
        startDate: "1922-08-11",
        numberPages: 5,
        timePerPage: 5,
        startPage: 4,
        notes: "NOTES",
        pdfLink: "klsdjfs",
        completed: false
      }
    });
    expect(resp.data.addExam).toBeFalsy();
    expect(resp.errors[0].message).toEqual(
      "Dates cannot be in the past and start learning date must be before exam date."
    );
  });

  it("should not add an exam, since start page is higher than number of pages", async () => {
    const resp = await mutate({
      query: ADD_EXAM_MUTATION,
      variables: {
        subject: "German",
        examDate: "2122-08-05",
        startDate: "2122-08-02",
        numberPages: 5,
        timePerPage: 5,
        startPage: 40,
        notes: "NOTES",
        pdfLink: "klsdjfs",
        completed: false
      }
    });
    expect(resp.data.addExam).toBeFalsy();
    expect(resp.errors[0].message).toEqual(
      "Start page cannot higher than the number of pages."
    );
  });
});
