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

import {
  ADD_EXAM_MUTATION,
  UPDATE_CURRENT_PAGE_MUTATION
} from "../../mutations.js";

// import { createTestClient } from "apollo-server-integration-testing";

describe("Test user resolver regex", () => {
  let server;
  let mutate;
  beforeAll(async () => {
    await setupDb();
    server = await setupApolloServer({ isAuth: true, userId: "samanthasId" });
    let client = createTestClient(server);
    mutate = client.mutate;
  });

  afterEach(async () => {
    await clearDatabase();
  });

  afterAll(async () => {
    await teardown();
  });

  it("should update current page if correct", async () => {
    const initialCount = await Exam.countDocuments();

    const resp = await mutate({
      query: ADD_EXAM_MUTATION,
      variables: {
        subject: "Editable Exam",
        examDate: "2122-08-11",
        startDate: "2122-08-05",
        numberPages: 5,
        timePerPage: 5,
        startPage: 1,
        notes: "My Test Notes",
        pdfLink: "klsdjfs",
        completed: false
      }
    });
    expect(resp.data.addExam).toBeTruthy();
    const newCount = await Exam.countDocuments();
    expect(newCount).toBe(initialCount + 1);

    const exam = await Exam.findOne({
      subject: "Editable Exam"
    });

    expect(exam).toBeTruthy();
    expect(exam.currentPage).toBe(1);

    const updateResp = await mutate({
      query: UPDATE_CURRENT_PAGE_MUTATION,
      variables: {
        examId: exam._id.toString(),
        page: 5
      }
    });
    expect(updateResp.data.updateCurrentPage).toBeTruthy();

    const newExam = await Exam.findOne({
      subject: "Editable Exam"
    });

    expect(newExam).toBeTruthy();
    expect(newExam.currentPage).toBe(5);

    const updateResp2 = await mutate({
      query: UPDATE_CURRENT_PAGE_MUTATION,
      variables: {
        examId: exam._id.toString(),
        page: 50
      }
    });
    expect(updateResp2.data.updateCurrentPage).toBeFalsy();
    expect(updateResp2.errors[0].message).toEqual(
      "The entered current page is higher than the number of pages for this exam."
    );

    const updateResp3 = await mutate({
      query: UPDATE_CURRENT_PAGE_MUTATION,
      variables: {
        examId: exam._id.toString(),
        page: 0
      }
    });
    expect(updateResp3.data.updateCurrentPage).toBeFalsy();
    expect(updateResp3.errors[0].message).toEqual(
      "The entered current page is lower than the start page for this exam."
    );
  });

  it("should not update current page, examId doesn't exist", async () => {
    const resp = await mutate({
      query: UPDATE_CURRENT_PAGE_MUTATION,
      variables: {
        examId: "5e8ef5f1800a7ded589961a4", //false Id
        page: 5
      }
    });
    expect(resp.data.updateCurrentPage).toBeFalsy();
    expect(resp.errors[0].message).toEqual("There is no exam with that id.");
  });
});
