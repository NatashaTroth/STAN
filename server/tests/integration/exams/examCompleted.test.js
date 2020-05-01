//https://www.apollographql.com/docs/apollo-server/testing/testing/
//https://mongoosejs.com/docs/jest.html
import { createTestClient } from "apollo-server-testing";
import {
  setupApolloServer,
  setupDb,
  addTestExam,
  clearDatabase,
  teardown
} from "../setup";
import { Exam, TodaysChunkCache } from "../../../models";

import { EXAM_COMPLETED_MUTATION } from "../../mutations.js";
import { GET_TODAYS_CHUNKS } from "../../queries.js";

// import { createTestClient } from "apollo-server-integration-testing";

describe("Test user resolver regex", () => {
  let server;
  let mutate;
  let query;
  beforeAll(async () => {
    await setupDb();
    server = await setupApolloServer({ isAuth: true, userId: "samanthasId" });
    let client = createTestClient(server);
    mutate = client.mutate;
    query = client.query;
  });

  afterEach(async () => {
    await clearDatabase();
  });

  afterAll(async () => {
    await teardown();
  });

  it("should make sure exam and chunk cache are completed when use examCompleted mutation", async () => {
    const testExam = await addTestExam({ subject: "Biology" });
    expect(await Exam.countDocuments({ userId: "samanthasId" })).toBe(1);

    const respTodaysChunks = await query({
      query: GET_TODAYS_CHUNKS
    });
    expect(
      respTodaysChunks.data.todaysChunkAndProgress.todaysChunks
    ).toBeTruthy();
    expect(
      respTodaysChunks.data.todaysChunkAndProgress.todaysChunks.length
    ).toBe(1);
    expect(
      await TodaysChunkCache.countDocuments({ userId: "samanthasId" })
    ).toBe(1);

    const resp = await mutate({
      query: EXAM_COMPLETED_MUTATION,
      variables: {
        id: testExam._id.toString()
      }
    });
    expect(resp.data.examCompleted).toBeTruthy();
    expect(await Exam.countDocuments({ userId: "samanthasId" })).toBe(1);
    expect(
      await TodaysChunkCache.countDocuments({ userId: "samanthasId" })
    ).toBe(1);

    const exam = await Exam.findOne({ userId: "samanthasId" });
    const todaysChunkCache = await TodaysChunkCache.findOne({
      userId: "samanthasId"
    });

    expect(exam.completed).toBeTruthy();
    expect(todaysChunkCache.completed).toBeTruthy();

    // const exam = await query({
    //   query: GET_EXAM,
    //   variables: {
    //     id:testExam._id.toString()
    //   }
    // });
  });
});
