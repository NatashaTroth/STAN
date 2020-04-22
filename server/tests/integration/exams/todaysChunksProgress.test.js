//https://www.apollographql.com/docs/apollo-server/testing/testing/
//https://mongoosejs.com/docs/jest.html
import { createTestClient } from "apollo-server-testing";
import {
  setupApolloServer,
  setupDb,
  addTestExam,
  addTestExams,
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
});
