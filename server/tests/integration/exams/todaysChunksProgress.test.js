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
  // GET_TODAYS_CHUNKS,
  GET_TODAYS_CHUNKS_PROGRESS
} from "../../queries.js";

import { UPDATE_CURRENT_PAGE_MUTATION } from "../../mutations.js";

describe("Test user resolver regex", () => {
  let server;
  let query;
  let mutate;
  // let testExams;

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

    const testExam = await addTestExam({
      subject: "Biology"
    });
    const resp = await query({
      query: GET_TODAYS_CHUNKS_PROGRESS
    });

    console.log(resp);
    expect(resp.data).toBeTruthy();
    expect(resp.data.todaysChunksProgress).toBe(0);
    const newCount = await TodaysChunkCache.countDocuments();
    expect(newCount).toBe(initialCount + 1);

    // update current page to 3
    // const respDeleteTodaysChunksCache = await TodaysChunkCache.deleteMany({
    //   userId: "samanthasId"
    // });
    // expect(respDeleteTodaysChunksCache).toBeTruthy();

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

  it("should correctly fetch today's chunks progress after updating current pages", async () => {
    //setup
    const testExam = await addTestExam({
      subject: "Biology"
    });
    const initialCount = await TodaysChunkCache.countDocuments();
    expect(initialCount).toBe(0);

    //Current todays chunks progress should be 0
    // console.log("FIRST FETCH");

    const resp1 = await query({
      query: GET_TODAYS_CHUNKS_PROGRESS
    });
    // console.log(resp1);
    expect(resp1.data).toBeTruthy();
    expect(resp1.data.todaysChunksProgress).toBe(0);
    const newCount = await TodaysChunkCache.countDocuments();
    expect(newCount).toBe(initialCount + 1);
    // console.log(await TodaysChunkCache.find({}));

    //Update page with mutation (changes the page in the exam)

    const updateResp = await mutate({
      query: UPDATE_CURRENT_PAGE_MUTATION,
      variables: {
        examId: testExam._id.toString(),
        page: 3
      }
    });
    expect(updateResp.data.updateCurrentPage).toBeTruthy();

    //refetch progress - should have changed
    console.log("SECOND FETCH");
    const resp2 = await query({
      query: GET_TODAYS_CHUNKS_PROGRESS
    });
    // console.log("after second");
    // console.log(await TodaysChunkCache.find({}));
    console.log(resp2);
    expect(resp2.data).toBeTruthy();
    //2 pages of 10 completed = 20%
    expect(resp2.data.todaysChunksProgress).toBe(20);
  });

  //TODO: SHOULD WORK WITH CHANGED CURRENT PAGE EVEN IF TODAYS CHUNKS WEREN'T FETCHED YET - BUT UNLIKELY, ESPECIALLY IF WE FETCH TODAYSCHUNKS IMMEDIATLY

  //------------------------------------------- Helper functions ------------------------------------------
  // async function addOneTestExam() {
  //   const exam1 = await addTestExam({
  //     subject: "Biology",
  //     color: "#979250"
  //   });

  //   return exam1;
  // }
});
