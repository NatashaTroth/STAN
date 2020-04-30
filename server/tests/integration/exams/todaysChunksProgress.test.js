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

import {
  UPDATE_CURRENT_PAGE_MUTATION,
  EXAM_COMPLETED_MUTATION
} from "../../mutations.js";

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

  // it("should correctly fetch today's chunks progress for the first time today", async () => {
  //   const initialCount = await TodaysChunkCache.countDocuments();

  //   const testExam = await addTestExam({
  //     subject: "Biology"
  //   });
  //   const resp = await query({
  //     query: GET_TODAYS_CHUNKS_PROGRESS
  //   });

  //   expect(resp.data).toBeTruthy();
  //   expect(resp.data.todaysChunksProgress).toBe(0);
  //   const newCount = await TodaysChunkCache.countDocuments();
  //   expect(newCount).toBe(initialCount + 1);

  //   // update current page to 3
  //   const respUpdate = await TodaysChunkCache.updateOne(
  //     { examId: testExam._id.toString() },
  //     { currentPage: 3 }
  //   );

  //   expect(respUpdate.ok).toBeTruthy();
  //   expect(respUpdate.nModified).toBe(1);

  //   const resp2 = await query({
  //     query: GET_TODAYS_CHUNKS_PROGRESS
  //   });

  //   expect(resp2.data).toBeTruthy();
  //   //2 pages of 10 completed = 20%
  //   expect(resp2.data.todaysChunksProgress).toBe(20);

  //   // update current page to 7
  //   const respUpdate2 = await TodaysChunkCache.updateOne(
  //     { examId: testExam._id.toString() },
  //     { currentPage: 7 }
  //   );
  //   expect(respUpdate2.ok).toBeTruthy();
  //   expect(respUpdate2.nModified).toBe(1);

  //   const resp3 = await query({
  //     query: GET_TODAYS_CHUNKS_PROGRESS
  //   });
  //   expect(resp3.data).toBeTruthy();
  //   //2 pages of 10 completed = 20%
  //   expect(resp3.data.todaysChunksProgress).toBe(60);

  //   const respExamCompleted = await query({
  //     query: EXAM_COMPLETED_MUTATION,
  //     variables: {
  //       id: testExam._id.toString()
  //     }
  //   });
  //   console.log(respExamCompleted);
  //   expect(respExamCompleted.data).toBeTruthy();

  //   const resp4 = await query({
  //     query: GET_TODAYS_CHUNKS_PROGRESS
  //   });
  //   expect(resp4.data).toBeTruthy();
  //   //2 pages of 10 completed = 20%
  //   expect(resp4.data.todaysChunksProgress).toBe(100);

  //   //TODO: TEST COMPLETED
  // });

  it("should correctly fetch today's chunks progress after updating current pages", async () => {
    //setup
    const testExam = await addTestExam({
      subject: "Biology"
    });
    const initialCount = await TodaysChunkCache.countDocuments();
    expect(initialCount).toBe(0);

    //Current todays chunks progress should be 0
    const resp1 = await query({
      query: GET_TODAYS_CHUNKS_PROGRESS
    });

    expect(resp1.data).toBeTruthy();
    expect(resp1.data.todaysChunksProgress).toBe(0);
    const newCount = await TodaysChunkCache.countDocuments();
    expect(newCount).toBe(initialCount + 1);

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
    const resp2 = await query({
      query: GET_TODAYS_CHUNKS_PROGRESS
    });

    expect(resp2.data).toBeTruthy();
    //2 pages of 10 completed = 20%
    expect(resp2.data.todaysChunksProgress).toBe(20);
  });

  it("should correctly fetch today's chunks progress, when there are no chunks today/no exams", async () => {
    const initialCountChunks = await TodaysChunkCache.countDocuments();
    expect(initialCountChunks).toBe(0);
    const initialCountExams = await Exam.countDocuments();
    expect(initialCountExams).toBe(0);

    const respFetchChunks = await query({
      query: GET_TODAYS_CHUNKS
    });
    expect(respFetchChunks.data.todaysChunks).toBeTruthy();
    expect(respFetchChunks.data.todaysChunks.length).toBe(0);

    const resp1 = await query({
      query: GET_TODAYS_CHUNKS_PROGRESS
    });

    expect(resp1.data).toBeTruthy();
    expect(resp1.data.todaysChunksProgress).toBe(100);
  });

  //TODO: SHOULD WORK WITH CHANGED CURRENT PAGE EVEN IF TODAYS CHUNKS WEREN'T FETCHED YET - BUT UNLIKELY, ESPECIALLY IF WE FETCH TODAYSCHUNKS IMMEDIATLY

  it.skip("should correctly fetch today's chunks progress when there are multiple exams", async () => {
    //setup
    const { exam1, exam2, exam3, exam4 } = await addTestExams();
    const initialCount = await TodaysChunkCache.countDocuments();
    expect(initialCount).toBe(0);

    //Current todays chunks progress should be 0
    const resp1 = await query({
      query: GET_TODAYS_CHUNKS_PROGRESS
    });
    const test = await query({
      query: GET_TODAYS_CHUNKS
    });

    console.log(test.data.todaysChunks);

    expect(resp1.data).toBeTruthy();
    expect(resp1.data.todaysChunksProgress).toBe(0);
    const newCount = await TodaysChunkCache.countDocuments();
    expect(newCount).toBe(initialCount + 3);

    /**
     * TOTAL DURATION OF TODAYS CHUNKS:
     * exam1 (Biology): 50, 10 pages -> 5 min per page, startpage 1
     * exam2 (Archeology): 180, 18 pages -> 10 min per page, startpage 50
     * exam3 (Chemistry): 410, 41 pages -> 10 min per page, startpage 1600
     * Total duration = 640
     * update exam1: 2*5 -> 10 min completed, 100/640*10 = 1.56%
     * update exam2: 180min + 10min = 190min, 100/640*190 = 30%
     */
    //---UPDATE FIRST EXAM---
    console.log(
      "---------------------------updating first exam---------------------------"
    );
    const updateResp = await mutate({
      query: UPDATE_CURRENT_PAGE_MUTATION,
      variables: {
        examId: exam1._id.toString(),
        page: 3
      }
    });
    expect(updateResp.data.updateCurrentPage).toBeTruthy();

    const resp2 = await query({
      query: GET_TODAYS_CHUNKS_PROGRESS
    });
    console.log(resp2);

    expect(resp2.data).toBeTruthy();
    expect(resp2.data.todaysChunksProgress).toBe(2);

    //---UPDATE SECOND EXAM---
    console.log(
      "---------------------------updating second exam---------------------------"
    );

    const updateResp2 = await mutate({
      query: UPDATE_CURRENT_PAGE_MUTATION,
      variables: {
        examId: exam2._id.toString(),
        page: 19 //completed
      }
    });
    expect(updateResp2.data.updateCurrentPage).toBeTruthy();

    //TODO!
    // const respFetchCache = await TodaysChunkCache.findOne({
    //   examId: exam2._id.toString()
    // });
    // expect(respFetchCache).toBeTruthy();
    // expect(respFetchCache.completed).toBeTruthy();

    const resp3 = await query({
      query: GET_TODAYS_CHUNKS_PROGRESS
    });
    console.log(resp3);
    expect(resp3.data.todaysChunksProgress).toBe(30);

    // //---UPDATE THIRD EXAM---
    // const updateResp3 = await mutate({
    //   query: UPDATE_CURRENT_PAGE_MUTATION,
    //   variables: {
    //     examId: exam3._id.toString(),
    //     page: 60
    //   }
    // });
    // expect(updateResp3.data.updateCurrentPage).toBeTruthy();

    // //---UPDATE FOURTH EXAM---
    // //shouldn't affect the results of the progress since the exam is in the future
    // const updateResp4 = await mutate({
    //   query: UPDATE_CURRENT_PAGE_MUTATION,
    //   variables: {
    //     examId: exam4._id.toString(),
    //     page: 10
    //   }
    // });
    // expect(updateResp4.data.updateCurrentPage).toBeTruthy();

    //------
    //refetch progress - should have changed
    // const resp2 = await query({
    //   query: GET_TODAYS_CHUNKS_PROGRESS
    // });
    // console.log(resp2);

    // expect(resp2.data).toBeTruthy();
    // //2 pages of 10 completed = 20%
    // expect(resp2.data.todaysChunksProgress).toBe(10);
  });
});

//TODO: SHOULD WORK WITH CHANGED CURRENT PAGE EVEN IF TODAYS CHUNKS WEREN'T FETCHED YET - BUT UNLIKELY, ESPECIALLY IF WE FETCH TODAYSCHUNKS IMMEDIATLY
