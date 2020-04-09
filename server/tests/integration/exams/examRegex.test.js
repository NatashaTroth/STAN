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

  it("should pass the exam regex tests and add an exam", async () => {
    const resp = await mutate({
      query: ADD_EXAM_MUTATION,
      variables: {
        subject: "Maths",
        examDate: new Date("2120-08-11"),
        startDate: new Date("2120-08-05"),
        numberPages: 5,
        timePerPage: 5,
        startPage: 4,
        notes: "NOTES",
        pdfLink: "klsdjfs",
        completed: false
      }
    });
    expect(resp.data.addExam).toBeTruthy();
  });

  it("should pass the exam regex tests and add an exam", async () => {
    const resp = await mutate({
      query: ADD_EXAM_MUTATION,
      variables: {
        subject: "Maths",
        examDate: new Date("2120/08/11"),
        startDate: new Date("2120/08/05"),
        numberPages: 5,
        timePerPage: 5,
        startPage: 4,
        notes: "NOTES",
        pdfLink: "klsdjfs",
        completed: false
      }
    });
    expect(resp.data.addExam).toBeTruthy();
  });

  it("should pass the exam regex tests and add an exam", async () => {
    const resp = await mutate({
      query: ADD_EXAM_MUTATION,
      variables: {
        subject: "Maths",
        examDate: new Date("2120.08.11"),
        startDate: new Date("2120.08.05"),
        numberPages: 5,
        timePerPage: 5,
        startPage: 4,
        notes: "NOTES",
        pdfLink: "klsdjfs",
        completed: false
      }
    });
    expect(resp.data.addExam).toBeTruthy();
  });

  it("should use regex to filter out wrong subject format", async () => {
    const resp = await mutate({
      query: ADD_EXAM_MUTATION,
      variables: {
        subject: "",
        examDate: new Date("2120-09-11"),
        startDate: new Date("2120-08-05"),
        numberPages: 5,
        timePerPage: 5,
        startPage: 6,
        notes: "NOTES",
        pdfLink: "klsdjfs",
        completed: false
      }
    });
    expect(resp.data.addExam).toBeFalsy();
    expect(resp.errors[0].message).toEqual(
      "Subject input has the wrong format. It cannot be empty. Max length 50 characters."
    );
  });

  it("should use regex to filter out wrong exam date format", async () => {
    const resp = await mutate({
      query: ADD_EXAM_MUTATION,
      variables: {
        subject: "Maths",
        examDate: "test",
        startDate: new Date("2120-08-11"),
        numberPages: 5,
        timePerPage: 5,
        startPage: 6,
        notes: "NOTES",
        pdfLink: "klsdjfs",
        completed: false
      }
    });

    expect(resp.data).toBeFalsy();
    expect(resp.errors[0].message).toEqual(
      'Variable "$examDate" got invalid value "test"; Expected type Date. Date input has the wrong format. Valid formats: dd/mm/yyyy, yyyy/mm/dd, mm/dd/yyyy. Valid separators: . / -'
    );
  });

  it("should use regex to filter out wrong start date format", async () => {
    let resp = await mutate({
      query: ADD_EXAM_MUTATION,
      variables: {
        subject: "Maths",
        examDate: new Date("2120-08-11"),
        startDate: "test",
        numberPages: 5,
        timePerPage: 5,
        startPage: 6,
        notes: "NOTES",
        pdfLink: "klsdjfs",
        completed: false
      }
    });

    expect(resp.data).toBeFalsy();
    expect(resp.errors[0].message).toEqual(
      'Variable "$startDate" got invalid value "test"; Expected type Date. Date input has the wrong format. Valid formats: dd/mm/yyyy, yyyy/mm/dd, mm/dd/yyyy. Valid separators: . / -'
    );
  });

  it("should use regex to filter out wrong start date format", async () => {
    const resp = await mutate({
      query: ADD_EXAM_MUTATION,
      variables: {
        subject: "Maths",
        examDate: new Date("2150-08-11"),
        startDate: "",
        numberPages: 5,
        timePerPage: 5,
        startPage: 6,
        notes: "NOTES",
        pdfLink: "klsdjfs",
        completed: false
      }
    });

    expect(resp.data).toBeFalsy();
    expect(resp.errors[0].message).toEqual(
      'Variable "$startDate" got invalid value ""; Expected type Date. Date input has the wrong format. Valid formats: dd/mm/yyyy, yyyy/mm/dd, mm/dd/yyyy. Valid separators: . / -'
    );
  });

  it("should use regex to filter out wrong time per page format", async () => {
    const resp = await mutate({
      query: ADD_EXAM_MUTATION,
      variables: {
        subject: "Maths",
        examDate: new Date("2120-08-11"),
        startDate: new Date("2120-08-05"),
        numberPages: 5,
        timePerPage: 0,
        startPage: null,
        notes: "NOTES",
        pdfLink: "klsdjfs",
        completed: false
      }
    });

    expect(resp.data.addExam).toBeFalsy();
    expect(resp.errors[0].message).toEqual(
      "Time per page input has the wrong format. It must be a positive number and cannot be empty. Max length 600 characters."
    );
  });

  it("should use regex to filter out wrong notes format.", async () => {
    const resp = await mutate({
      query: ADD_EXAM_MUTATION,
      variables: {
        subject: "Maths",
        examDate: new Date("2120-08-11"),
        startDate: new Date("2120-08-05"),
        numberPages: 5,
        timePerPage: 5,
        startPage: 6,
        notes: "d".repeat(100000001),
        pdfLink: "klsdjfs",
        completed: false
      }
    });
    expect(resp.data.addExam).toBeFalsy();
    expect(resp.errors[0].message).toEqual(
      "Notes input has the wrong format. It cannot exceed 100000000 characters."
    );
  });
});
