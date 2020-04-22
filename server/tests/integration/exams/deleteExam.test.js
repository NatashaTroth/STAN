//https://www.apollographql.com/docs/apollo-server/testing/testing/
//https://mongoosejs.com/docs/jest.html
import { createTestClient } from "apollo-server-testing";
import {
  setupApolloServer,
  setupDb,
  addTestExam,
  // clearDatabase,
  teardown
} from "../setup";
import { Exam } from "../../../models";

import { DELETE_EXAM_MUTATION } from "../../mutations.js";

//TODO: ADD THIS TO THIS TEST TOO?
// import { UPDATE_CURRENT_PAGE_MUTATION } from "../../mutations.js";

// import { createTestClient } from "apollo-server-integration-testing";

describe("Test user resolver regex", () => {
  let server;
  let mutate;
  let testExam;

  beforeAll(async () => {
    await setupDb();
    server = await setupApolloServer({ isAuth: true, userId: "samanthasId" });
    let client = createTestClient(server);
    mutate = client.mutate;
    testExam = await addTestExam({ subject: "Biology" });
  });

  // afterEach(async () => {
  //   await clearDatabase();
  // });

  afterAll(async () => {
    await teardown();
  });

  it("should delete exam1", async () => {
    const initialCount = await Exam.countDocuments();

    const resp = await mutate({
      query: DELETE_EXAM_MUTATION,
      variables: {
        id: testExam._id.toString()
      }
    });

    expect(resp.data).toBeTruthy();
    const newCount = await Exam.countDocuments();
    expect(newCount).toBe(initialCount - 1);
  });

  it("shouldn't delete the exam - since it doesn't exist", async () => {
    let falseId = "5e923a29a39c7738fb50e632";
    if (testExam._id.toString() === falseId)
      falseId = "5e923a29a39c7738fb50e635";
    const initialCount = await Exam.countDocuments();

    const resp = await mutate({
      query: DELETE_EXAM_MUTATION,
      variables: {
        id: falseId
      }
    });

    expect(resp.data.deleteExam).toBeFalsy();
    expect(resp.errors[0].message).toEqual(
      "No exam exists with this exam id: " + falseId + " for this user."
    );
    const newCount = await Exam.countDocuments();
    expect(newCount).toBe(initialCount);
  });
});
