//https://www.apollographql.com/docs/apollo-server/testing/testing/
//https://mongoosejs.com/docs/jest.html
import { createTestClient } from "apollo-server-testing";
import {
  setupApolloServer,
  setupDb,
  // addTestExam,
  clearDatabase,
  teardown
} from "../setup";
import { Exam } from "../../../models";

import { GET_EXAM_QUERY, GET_EXAMS_QUERY } from "../../queries.js";

// import { createTestClient } from "apollo-server-integration-testing";

describe("Test user resolver regex", () => {
  let server;
  let query;
  beforeAll(async () => {
    await setupDb();
    server = await setupApolloServer({ isAuth: true, userId: "samanthasId" });
    let client = createTestClient(server);
    query = client.query;
  });

  afterEach(async () => {
    await clearDatabase();
  });

  afterAll(async () => {
    await teardown();
  });

  it("should fetch the test exam", async () => {
    const exam = await addTestExam("Samantha's Exam");

    const resp = await query({
      query: GET_EXAM_QUERY,
      variables: {
        id: exam._id.toString()
      }
    });
    expect(resp.data.exam).toBeTruthy();
    expect(exam.subject).toBe(resp.data.exam.subject);
    expect(exam.examDate.toString()).toBe(resp.data.exam.examDate.toString());
    expect(exam.startDate.toString()).toBe(resp.data.exam.startDate.toString());
    expect(exam.numberPages).toBe(resp.data.exam.numberPages);
    expect(exam.timePerPage).toBe(resp.data.exam.timePerPage);
    expect(exam.timesRepeat).toBe(resp.data.exam.timesRepeat);
    expect(exam.startPage).toBe(resp.data.exam.startPage);
    expect(exam.currentPage).toBe(resp.data.exam.currentPage);
    expect(exam.pdfLink).toBe(resp.data.exam.pdfLink);
    expect(exam.notes).toBe(resp.data.exam.notes);
    expect(exam.completed).toBe(resp.data.exam.completed);
  });

  it("should not fetch an exam, wrong id", async () => {
    const resp = await query({
      query: GET_EXAM_QUERY,
      variables: {
        id: "5e8ef5f1800a7ded589961a4" //false Id
      }
    });

    expect(resp.data.exam).toBeFalsy();
  });

  it("should fetch all exams", async () => {
    await addTestExam("Biology");
    await addTestExam("Archeology");
    await addTestExam("Dance");
    const exam = await addTestExam("Chemistry");

    const resp = await query({
      query: GET_EXAMS_QUERY
    });
    // console.log(JSON.stringify(resp));
    expect(resp.data.exams).toBeTruthy();

    //Check order
    expect(resp.data.exams[0].subject).toBe("Archeology");
    expect(resp.data.exams[1].subject).toBe("Biology");
    expect(resp.data.exams[2].subject).toBe("Chemistry");
    expect(resp.data.exams[3].subject).toBe("Dance");

    //Check one exam
    expect(exam.examDate.toString()).toBe(
      resp.data.exams[2].examDate.toString()
    );
    expect(exam.startDate.toString()).toBe(
      resp.data.exams[2].startDate.toString()
    );
    expect(exam.numberPages).toBe(resp.data.exams[2].numberPages);
    expect(exam.timePerPage).toBe(resp.data.exams[2].timePerPage);
    expect(exam.timesRepeat).toBe(resp.data.exams[2].timesRepeat);
    expect(exam.startPage).toBe(resp.data.exams[2].startPage);
    expect(exam.currentPage).toBe(resp.data.exams[2].currentPage);
    expect(exam.pdfLink).toBe(resp.data.exams[2].pdfLink);
    expect(exam.notes).toBe(resp.data.exams[2].notes);
    expect(exam.completed).toBe(resp.data.exams[2].completed);
  });

  it("should fetch empty array", async () => {
    const resp = await query({
      query: GET_EXAMS_QUERY
    });

    expect(resp.data.exams).toBeTruthy();
    expect(resp.data.exams.length).toBe(0);
  });

  async function addTestExam(subject) {
    const exam = await Exam.create({
      subject: subject,
      examDate: "2522-04-11",
      startDate: "2522-04-05",
      numberPages: 50,
      timePerPage: 5,
      startPage: 1,
      currentPage: 1,
      timesRepeat: 2,
      notes: "Samantha's notes",
      pdfLink: "samanthas-link.stan",
      color: "#FFFFFF",
      completed: false,
      userId: "samanthasId"
    });

    if (!exam) throw new Error("Could not add a test exam");

    return exam;
  }
});
