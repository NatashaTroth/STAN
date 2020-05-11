//https://www.apollographql.com/docs/apollo-server/testing/testing/
//https://mongoosejs.com/docs/jest.html
import { createTestClient } from "apollo-server-testing";
import {
  setupApolloServer,
  setupDb,
  addTestExam,
  addTestExams,
  clearDatabase,
  getFutureDay,
  teardown
} from "../setup";
// import { Exam } from "../../../models";

import { GET_CALENDAR_CHUNKS } from "../../queries.js";
// import { fetchCalendarChunks } from "../../../helpers/examHelpers";

//TODO: ADD THIS TO THIS TEST TOO?
// import { UPDATE_CURRENT_PAGE_MUTATION } from "../../mutations.js";

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

  it.only("should correctly fetch the calendar chunks", async () => {
    const testExams = await addTestExams();
    const resp = await query({
      query: GET_CALENDAR_CHUNKS
    });
    // console.log(JSON.stringify(resp));

    expect(resp.data.calendarChunks).toBeTruthy();
    // console.log(testExams);
    // console.log("----");
    // console.log(resp.data.calendarChunks);

    expect(resp.data.calendarChunks.calendarChunks.length).toBe(4);
    let exam;
    const examColor = "#ff554d";

    exam = testExams.exam1;
    console.log(resp.data.calendarChunks.calendarChunks[2]);
    expect(resp.data.calendarChunks.calendarChunks[2]).toMatchObject({
      title: exam.subject,
      start: exam.startDate,
      end: getFutureDay(exam.examDate, -1),
      color: exam.color,
      extendedProps: {
        examDate: exam.examDate,
        currentPage: exam.currentPage,
        numberPagesLeftTotal: 50,
        numberPagesPerDay: 10,
        durationTotal: 250,
        durationPerDay: 50
      }
    });
    a;
    expect(
      resp.data.calendarChunks.calendarChunks[2].extendedProps.pdfLinks[0]
    ).toBe(exam.pdfLinks[0]);
    expect(resp.data.calendarChunks.calendarExams[2]).toMatchObject({
      title: exam.subject,
      start: exam.examDate,
      end: exam.examDate,
      color: examColor
    });

    exam = testExams.exam2;
    expect(resp.data.calendarChunks.calendarChunks[1]).toMatchObject({
      title: exam.subject,
      start: exam.startDate,
      end: getFutureDay(exam.examDate, -1),
      color: exam.color,
      extendedProps: {
        examDate: exam.examDate,
        currentPage: exam.currentPage,
        numberPagesLeftTotal: 71,
        numberPagesPerDay: 36,
        durationTotal: 710,
        durationPerDay: 360,
        pdfLinks: ["samanthas-link.stan"]
      }
    });
    expect(resp.data.calendarChunks.calendarExams[1]).toMatchObject({
      title: exam.subject,
      start: exam.examDate,
      end: exam.examDate,
      color: examColor
    });

    exam = testExams.exam3;
    expect(resp.data.calendarChunks.calendarChunks[0]).toMatchObject({
      title: exam.subject,
      start: exam.startDate,
      end: getFutureDay(exam.examDate, -1),
      color: exam.color,
      extendedProps: {
        examDate: exam.examDate,
        currentPage: exam.currentPage,
        numberPagesLeftTotal: 48,
        numberPagesPerDay: 48,
        durationTotal: 480,
        durationPerDay: 480,
        pdfLinks: [exam.pdfLinks]
      }
    });
    expect(resp.data.calendarChunks.calendarExams[0]).toMatchObject({
      title: exam.subject,
      start: exam.examDate,
      end: exam.examDate,
      color: examColor
    });

    exam = testExams.exam4;

    expect(resp.data.calendarChunks.calendarChunks[3]).toMatchObject({
      title: exam.subject,
      start: exam.startDate,
      end: getFutureDay(exam.examDate, -1),
      color: exam.color,
      extendedProps: {
        examDate: exam.examDate,
        currentPage: exam.currentPage,
        numberPagesLeftTotal: 50,
        numberPagesPerDay: 3,
        durationTotal: 250,
        durationPerDay: 15,
        pdfLinks: [exam.pdfLinks]
      }
    });
    expect(resp.data.calendarChunks.calendarExams[3]).toMatchObject({
      title: exam.subject,
      start: exam.examDate,
      end: exam.examDate,
      color: examColor
    });
  });

  it("should make sure that calendar chunks are empty, since the exam date in only exam added is today", async () => {
    await addTestExam({
      subject: "Biology",
      examDate: new Date()
    });
    const resp = await query({
      query: GET_CALENDAR_CHUNKS
    });

    expect(resp.data.calendarChunks).toBeTruthy();

    expect(resp.data.calendarChunks.calendarChunks.length).toBe(0);
  });
});
