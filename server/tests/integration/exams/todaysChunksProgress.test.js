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
import { Exam, TodaysChunkCache } from "../../../models";

import {
  GET_TODAYS_CHUNKS,
  GET_TODAYS_CHUNKS_PROGRESS
} from "../../queries.js";

import { UPDATE_CURRENT_PAGE_MUTATION } from "../../mutations.js";

describe("Test user resolver regex", () => {
  let server;
  let query;
  let mutate;
  let testExams;

  beforeAll(async () => {
    await setupDb();
    server = await setupApolloServer({ isAuth: true, userId: "samanthasId" });
    let client = createTestClient(server);
    query = client.query;
    mutate = client.mutate;
    // testExams = await addTestExams();
  });

  afterEach(async () => {
    await clearDatabase();
  });

  afterAll(async () => {
    await teardown();
  });

  it("should correctly fetch today's chunks progress for the first time today", async () => {
    const initialCount = await TodaysChunkCache.countDocuments();

    const testExam = await addOneTestExam();
    const resp = await query({
      query: GET_TODAYS_CHUNKS_PROGRESS
    });

    // console.log(resp);
    expect(resp.data).toBeTruthy();
    expect(resp.data.todaysChunksProgress).toBe(0);
    const newCount = await TodaysChunkCache.countDocuments();
    expect(newCount).toBe(initialCount + 1);

    // update current page to 3
    const respUpdate = await TodaysChunkCache.updateOne(
      { examId: testExam._id.toString() },
      { currentPage: 3 }
    );
    expect(respUpdate.ok).toBeTruthy();
    expect(respUpdate.nModified).toBe(1);

    const resp2 = await query({
      query: GET_TODAYS_CHUNKS_PROGRESS
    });
    expect(resp2.data).toBeTruthy();
    //2 pages of 10 completed = 20%
    expect(resp2.data.todaysChunksProgress).toBe(20);

    // update current page to 7
    const respUpdate2 = await TodaysChunkCache.updateOne(
      { examId: testExam._id.toString() },
      { currentPage: 7 }
    );
    expect(respUpdate2.ok).toBeTruthy();
    expect(respUpdate2.nModified).toBe(1);

    const resp3 = await query({
      query: GET_TODAYS_CHUNKS_PROGRESS
    });
    expect(resp3.data).toBeTruthy();
    //2 pages of 10 completed = 20%
    expect(resp3.data.todaysChunksProgress).toBe(60);

    //TODO: TEST COMPLETED
  });

  it.skip("should correctly fetch today's chunks progress after updating current pages", async () => {
    const testExams = await addTestExams();
    //update current page of first exam
    // numberPagesToday: 10,
    // duration: 50,
    // daysLeft: 5,
    // totalNumberDays: 5,
    // numberPagesWithRepeat: 50,
    // notEnoughTime: false
    const updateResp1 = await mutate({
      query: UPDATE_CURRENT_PAGE_MUTATION,
      variables: {
        examId: testExams.exam1._id.toString(),
        page: 5
      }
    });
    // expect(updateResp1.data.updateCurrentPage).toBeTruthy();
    // const newExam = await Exam.findOne({
    //   subject: "Biology"
    // });
    // console.log(newExam);

    const resp1 = await query({
      query: GET_TODAYS_CHUNKS_PROGRESS
    });

    expect(resp1.data).toBeTruthy();

    expect(resp1.data.todaysChunksProgress).not.toBe(0);
  });

  //------------------------------------------- Helper functions ------------------------------------------
  async function addOneTestExam() {
    const exam1 = await addTestExam({
      subject: "Biology",
      color: "#979250"
    });

    return exam1;
  }

  async function addTestExams() {
    const exam1 = await addTestExam({
      subject: "Biology",
      color: "#979250"
    });
    const exam2 = await addTestExam({
      subject: "Archeology",
      examDate: getFutureDay(new Date(), 2),
      startDate: getFutureDay(new Date(), -5),
      numberPages: 42,
      timePerPage: 10,
      startPage: 7,
      currentPage: 50,
      timesRepeat: 2,
      color: "#2444A8"
    });
    const exam3 = await addTestExam({
      subject: "Chemistry",
      examDate: getFutureDay(new Date(), 1),
      startDate: getFutureDay(new Date(), -20),
      numberPages: 60,
      timePerPage: 10,
      startPage: 8,
      currentPage: 200,
      timesRepeat: 5,
      color: "#2328A9"
    });
    const exam4 = await addTestExam({
      subject: "Dance",
      examDate: getFutureDay(new Date(), 30),
      startDate: getFutureDay(new Date(), 51),
      color: "#85625A"
    });

    // return { exam1 };
    return { exam1, exam2, exam3, exam4 };
  }

  async function addTestExam({
    subject,
    examDate,
    startDate,
    numberPages,
    timePerPage,
    startPage,
    currentPage,
    timesRepeat,
    color
  }) {
    const exam = await Exam.create({
      subject: subject || "Test Subject",
      examDate: examDate || getFutureDay(new Date(), 5),
      startDate: startDate || new Date(),
      numberPages: numberPages || 50,
      timePerPage: timePerPage || 5,
      startPage: startPage || 1,
      currentPage: currentPage || startPage || 1,
      timesRepeat: timesRepeat || 1,
      notes: "Samantha's notes",
      pdfLink: "samanthas-link.stan",
      color: color || "#FFFFFF",
      completed: false,
      userId: "samanthasId"
    });

    if (!exam) throw new Error("Could not add a test exam");

    return exam;
  }

  function getFutureDay(date, numberDaysInFuture) {
    const nextDay = new Date(date);
    nextDay.setDate(date.getDate() + numberDaysInFuture);
    return new Date(nextDay);
  }
});
