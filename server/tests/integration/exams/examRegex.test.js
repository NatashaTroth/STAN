//https://www.apollographql.com/docs/apollo-server/testing/testing/
//https://mongoosejs.com/docs/jest.html
import { createTestClient } from "apollo-server-testing";
import { setupApolloServer, setupDb, teardown } from "../setup";

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

  afterAll(async () => {
    await teardown();
  });

  //TODO: PUT IN SEPARATE ITS, SO DONE IN SEPARATE ORDER?
  it("should pass the exam regex tests and add an exam", async () => {
    const resp = await mutate({
      query: ADD_EXAM_MUTATION,
      variables: {
        subject: "Maths",
        examDate: new Date("2020-08-11"),
        startDate: new Date("2020-08-05"),
        numberPages: 5,
        timePerPage: 5,
        startPage: 6,
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
        examDate: new Date("2020-09-11"),
        startDate: new Date("2020-08-05"),
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
      "Subject input has the wrong format."
    );
  });

  it("should use regex to filter out wrong exam date format", async () => {
    const resp = await mutate({
      query: ADD_EXAM_MUTATION,
      variables: {
        subject: "Maths",
        examDate: "test",
        startDate: new Date("2020-08-11"),
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
      "Exam date input has the wrong format."
    );
  });

  // it("should use regex to filter out wrong start date format", async () => {
  //   let resp = await mutate({
  //     query: ADD_EXAM_MUTATION,
  //     variables: {
  //       subject: "Maths",
  //       examDate: new Date("2020-08-11"),
  //       startDate: "test",
  //       numberPages: 5,
  //       timePerPage: 5,
  //       startPage: 6,
  //       notes: "NOTES",
  //       pdfLink: "klsdjfs",
  //       completed: false
  //     }
  //   });
  //   expect(resp.data.addExam).toBeFalsy();
  //   expect(resp.errors[0].message).toEqual(
  //     "Study start date input has the wrong format."
  //   );
  // });

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

    expect(resp.data.addExam).toBeTruthy();
  });

  it("should use regex to filter out wrong time per page format", async () => {
    const resp = await mutate({
      query: ADD_EXAM_MUTATION,
      variables: {
        subject: "Maths",
        examDate: new Date("2020-08-11"),
        startDate: new Date("2020-08-05"),
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
      "Time per page has to be higher than 0."
    );
  });

  it("should use regex to filter out wrong notes format.", async () => {
    const resp = await mutate({
      query: ADD_EXAM_MUTATION,
      variables: {
        subject: "Maths",
        examDate: new Date("2020-08-11"),
        startDate: new Date("2020-08-05"),
        numberPages: 5,
        timePerPage: 5,
        startPage: 6,
        notes: "d".repeat(100000001),
        pdfLink: "klsdjfs",
        completed: false
      }
    });
    expect(resp.data.addExam).toBeFalsy();
    expect(resp.errors[0].message).toEqual("Notes input has the wrong format.");
  });
});
