//https://www.apollographql.com/docs/apollo-server/testing/testing/
//https://mongoosejs.com/docs/jest.html
import { createTestClient } from "apollo-server-testing";
import {
  setupApolloServer,
  setupDb,
  addTestExam,
  addTestExams,
  // clearDatabase,
  teardown
} from "../setup";
import { Exam } from "../../../models";

import { GET_CALENDAR_CHUNKS } from "../../queries.js";
// import { fetchCalendarChunks } from "../../../helpers/examHelpers";

//TODO: ADD THIS TO THIS TEST TOO?
// import { UPDATE_CURRENT_PAGE_MUTATION } from "../../mutations.js";

// import { createTestClient } from "apollo-server-integration-testing";

describe("Test user resolver regex", () => {
  let server;
  let query;
  let testExams;

  beforeAll(async () => {
    await setupDb();
    server = await setupApolloServer({ isAuth: true, userId: "samanthasId" });
    let client = createTestClient(server);
    query = client.query;
    testExams = await addTestExams();
  });

  // afterEach(async () => {
  //   await clearDatabase();
  // });

  afterAll(async () => {
    await teardown();
  });

  it("should correctly fetch the calendar chunks", async () => {
    const resp = await query({
      query: GET_CALENDAR_CHUNKS
    });
    // console.log(JSON.stringify(resp));

    expect(resp.data.calendarChunks).toBeTruthy();
    expect(resp.data.calendarChunks.length).toBe(4);

    let exam = testExams.exam2;
    expect(resp.data.calendarChunks[0]).toMatchObject({
      subject: exam.subject,
      start: exam.startDate,
      end: exam.examDate,
      details: {
        examDate: exam.examDate,
        currentPage: exam.currentPage,
        numberPagesLeftTotal: 35,
        numberPagesPerDay: 18,
        durationTotal: 350,
        durationPerDay: 180
      },
      color: exam.color
    });

    exam = testExams.exam1;
    expect(resp.data.calendarChunks[1]).toMatchObject({
      subject: exam.subject,
      start: exam.startDate,
      end: exam.examDate,
      details: {
        examDate: exam.examDate,
        currentPage: exam.currentPage,
        numberPagesLeftTotal: 50,
        numberPagesPerDay: 10,
        durationTotal: 250,
        durationPerDay: 50
      },
      color: exam.color
    });

    exam = testExams.exam3;
    expect(resp.data.calendarChunks[2]).toMatchObject({
      subject: exam.subject,
      start: exam.startDate,
      end: exam.examDate,
      details: {
        examDate: exam.examDate,
        currentPage: exam.currentPage,
        numberPagesLeftTotal: 1401,
        numberPagesPerDay: 1401,
        durationTotal: 14010,
        durationPerDay: 14010
      },
      color: exam.color
    });

    exam = testExams.exam4;
    expect(resp.data.calendarChunks[3]).toMatchObject({
      subject: exam.subject,
      start: exam.startDate,
      end: exam.examDate,
      details: {
        examDate: exam.examDate,
        currentPage: exam.currentPage,
        numberPagesLeftTotal: 50,
        numberPagesPerDay: 3,
        durationTotal: 250,
        durationPerDay: 15
      },
      color: exam.color
    });
  });
});
