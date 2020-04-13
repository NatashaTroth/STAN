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

import { ADD_EXAM_MUTATION, UPDATE_EXAM_MUTATION } from "../../mutations.js";

// import { createTestClient } from "apollo-server-integration-testing";

describe("Test user resolver regex", () => {
  let server;
  let mutate;
  let testExams;
  beforeAll(async () => {
    await setupDb();
    server = await setupApolloServer({ isAuth: true, userId: "samanthasId" });
    let client = createTestClient(server);
    mutate = client.mutate;
    testExams = await addTestExams();
  });

  afterEach(async () => {
    await clearDatabase();
  });

  afterAll(async () => {
    await teardown();
  });

  it("should update the exam correctly", async () => {
    expect(true).toBeTruthy();
    const initialCount = await Exam.countDocuments();

    const resp = await mutate({
      query: UPDATE_EXAM_MUTATION,
      variables: {
        id: testExams.exam1._id.toString(),
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
      _id: testExams.exam1._id.toString()
    });
    expect(editedExam).toBeTruthy();
    expect(editedExam.subject).toBe("Editable Exam");
  });

  //TODO ADD MORE TESTS

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
      numberPages: 600,
      timePerPage: 10,
      startPage: 8,
      currentPage: 1600,
      timesRepeat: 5,
      color: "#2328A9"
    });
    const exam4 = await addTestExam({
      subject: "Dance",
      examDate: getFutureDay(new Date(), 30),
      startDate: getFutureDay(new Date(), 51),
      color: "#85625A"
    });

    // return exam1;
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
