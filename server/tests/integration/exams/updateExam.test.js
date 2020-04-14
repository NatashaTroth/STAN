//https://www.apollographql.com/docs/apollo-server/testing/testing/
//https://mongoosejs.com/docs/jest.html
import { createTestClient } from "apollo-server-testing";
import {
  setupApolloServer,
  setupDb,
  // addTestExam,
  // clearDatabase,
  teardown
} from "../setup";
import { Exam } from "../../../models";

import { UPDATE_EXAM_MUTATION } from "../../mutations.js";

//TODO TEST REGEX HERE TOO?

describe("Test user resolver regex", () => {
  let server;
  let mutate;
  let testExam;
  beforeAll(async () => {
    await setupDb();
    server = await setupApolloServer({ isAuth: true, userId: "samanthasId" });
    let client = createTestClient(server);
    mutate = client.mutate;
    testExam = await addTestExam();
  });

  // afterEach(async () => {
  //   await clearDatabase();
  // });

  afterAll(async () => {
    await teardown();
  });

  it("should update the exam correctly", async () => {
    const initialCount = await Exam.countDocuments();

    const resp = await mutate({
      query: UPDATE_EXAM_MUTATION,
      variables: {
        id: testExam._id.toString(),
        subject: "Editable Exam",
        examDate: "2122-08-11",
        startDate: "2122-08-05",
        numberPages: 5,
        timePerPage: 5,
        startPage: 1
      }
    });

    expect(resp.data.updateExam).toBeTruthy();
    const newCount = await Exam.countDocuments();
    expect(newCount).toBe(initialCount);
    expect(resp.data.updateExam).toBeTruthy();
    expect(resp.data.updateExam.subject).toBe("Editable Exam");

    const editedExam = await Exam.findOne({
      _id: testExam._id.toString()
    });

    expect(editedExam).toBeTruthy();
    expect(editedExam.subject).toBe("Editable Exam");
  });

  it("should not update the exam, since the exam doesn't exist", async () => {
    let falseId = "5e923a29a39c7738fb50e632";
    if (testExam._id.toString() === falseId)
      falseId = "5e923a29a39c7738fb50e635";
    const resp = await mutate({
      query: UPDATE_EXAM_MUTATION,
      variables: {
        id: falseId,
        subject: "German",
        examDate: "2122-08-05",
        startDate: "2122-08-11",
        numberPages: 5,
        timePerPage: 5,
        startPage: 4,
        notes: "NOTES",
        pdfLink: "klsdjfs",
        completed: false
      }
    });

    expect(resp.data).toBeFalsy();
    expect(resp.errors[0].message).toEqual(
      "No exam exists with this exam id: " + falseId + " for this user."
    );
  });

  it("should not update the exam, since start date is after exam date", async () => {
    const resp = await mutate({
      query: UPDATE_EXAM_MUTATION,
      variables: {
        id: testExam._id.toString(),
        subject: "German",
        examDate: "2122-08-05",
        startDate: "2122-08-11",
        numberPages: 5,
        timePerPage: 5,
        startPage: 4,
        notes: "NOTES",
        pdfLink: "klsdjfs",
        completed: false
      }
    });

    expect(resp.data).toBeFalsy();
    expect(resp.errors[0].message).toEqual(
      "Dates cannot be in the past and start learning date must be before exam date."
    );
  });

  it("should not update the exam, since start date is the same as exam date", async () => {
    const resp = await mutate({
      query: UPDATE_EXAM_MUTATION,
      variables: {
        id: testExam._id.toString(),
        subject: "German",
        examDate: "2122-08-05",
        startDate: "2122-08-05",
        numberPages: 5,
        timePerPage: 5,
        startPage: 4,
        notes: "NOTES",
        pdfLink: "klsdjfs",
        completed: false
      }
    });
    expect(resp.data).toBeFalsy();
    expect(resp.errors[0].message).toEqual(
      "Careful! You shouldn't start learning on the same day as the test. Start date should be at least 1 day before the test."
    );
  });

  it("should not update the exam, since dates are in the past", async () => {
    const resp = await mutate({
      query: UPDATE_EXAM_MUTATION,
      variables: {
        id: testExam._id.toString(),
        subject: "German",
        examDate: "1922-08-05",
        startDate: "1922-08-11",
        numberPages: 5,
        timePerPage: 5,
        startPage: 4,
        notes: "NOTES",
        pdfLink: "klsdjfs",
        completed: false
      }
    });
    expect(resp.data).toBeFalsy();
    expect(resp.errors[0].message).toEqual(
      "Dates cannot be in the past and start learning date must be before exam date."
    );
  });

  it("should not update the exam, since start page is higher than number of pages", async () => {
    const resp = await mutate({
      query: UPDATE_EXAM_MUTATION,
      variables: {
        id: testExam._id.toString(),
        subject: "German",
        examDate: "2122-08-05",
        startDate: "2122-08-02",
        numberPages: 5,
        timePerPage: 5,
        startPage: 40,
        notes: "NOTES",
        pdfLink: "klsdjfs",
        completed: false
      }
    });
    expect(resp.data).toBeFalsy();
    expect(resp.errors[0].message).toEqual(
      "Start page cannot higher than the number of pages."
    );
  });

  //_----------------------------HELPERS-------------------

  // async function addTestExams() {
  //   const exam1 = await addTestExam({
  //     subject: "Biology",
  //     color: "#979250"
  //   });

  //   return exam1;
  // }

  async function addTestExam() {
    const exam = await Exam.create({
      subject: "Test Subject",
      examDate: getFutureDay(new Date(), 5),
      startDate: new Date(),
      numberPages: 50,
      timePerPage: 5,
      startPage: 1,
      currentPage: 1,
      timesRepeat: 1,
      notes: "Samantha's notes",
      pdfLink: "samanthas-link.stan",
      color: "#FFFFFF",
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
