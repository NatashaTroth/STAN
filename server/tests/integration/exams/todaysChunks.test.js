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

import { GET_TODAYS_CHUNKS } from "../../queries.js";

//TODO: ADD THIS TO THIS TEST TOO?
// import { UPDATE_CURRENT_PAGE_MUTATION } from "../../mutations.js";

// import { createTestClient } from "apollo-server-integration-testing";

describe("Test user resolver regex", () => {
  let server;
  let query;
  let testExams;

  beforeAll(async () => {
    await setupDb();
    server = await setupApolloServer({ isAuth: true, userId: "samanthasId" });
    let client = createTestClient(server);
    query = client.mutate;
    testExams = await addTestExams();
  });

  // afterEach(async () => {
  //   await clearDatabase();
  // });

  afterAll(async () => {
    await teardown();
  });

  it("should correctly fetch today's chunks", async () => {
    // const { exam1, exam2, exam3, exam4 } = addTestExams();
    // const exam1 = aaddTestExams();
    // console.log(testExams);

    const resp = await query({
      query: GET_TODAYS_CHUNKS
    });
    // console.log(JSON.stringify(resp));

    expect(resp.data.todaysChunks).toBeTruthy();
    expect(resp.data.todaysChunks.length).toBe(3);

    // resp.data.todaysChunks[0].examDate.
    resp.data.todaysChunks[0].exam.id.toString();
    expect(resp.data.todaysChunks[0]).toMatchObject({
      exam: {
        id: testExams.exam1._id.toString(),
        subject: testExams.exam1.subject,
        examDate: testExams.exam1.examDate,
        startDate: testExams.exam1.startDate,
        numberPages: testExams.exam1.numberPages,
        timesRepeat: testExams.exam1.timesRepeat,
        currentPage: testExams.exam1.currentPage,
        pdfLink: testExams.exam1.pdfLink
      },
      numberPagesToday: 10,
      duration: 50,
      daysLeft: 5,
      totalNumberDays: 5,
      numberPagesWithRepeat: 50,
      notEnoughTime: false
    });

    expect(resp.data.todaysChunks[1]).toMatchObject({
      exam: {
        id: testExams.exam2._id.toString(),
        subject: testExams.exam2.subject,
        examDate: testExams.exam2.examDate,
        startDate: testExams.exam2.startDate,
        numberPages: testExams.exam2.numberPages,
        timesRepeat: testExams.exam2.timesRepeat,
        currentPage: testExams.exam2.currentPage,
        pdfLink: testExams.exam2.pdfLink
      },
      numberPagesToday: 18,
      duration: 180,
      daysLeft: 2,
      totalNumberDays: 7,
      numberPagesWithRepeat: 84,
      notEnoughTime: false
    });

    expect(resp.data.todaysChunks[2]).toMatchObject({
      exam: {
        id: testExams.exam3._id.toString(),
        subject: testExams.exam3.subject,
        examDate: testExams.exam3.examDate,
        startDate: testExams.exam3.startDate,
        numberPages: testExams.exam3.numberPages,
        timesRepeat: testExams.exam3.timesRepeat,
        currentPage: testExams.exam3.currentPage,
        pdfLink: testExams.exam3.pdfLink
      },
      numberPagesToday: 1401,
      duration: 14010,
      daysLeft: 1,
      totalNumberDays: 21,
      numberPagesWithRepeat: 3000,
      notEnoughTime: false
    });
  });

  it("should not fetch today's chunks, since dates are the same (however should never occur)", async () => {
    const exam = await addTestExam({
      subject: "Wrong",
      examDate: new Date(),
      startDate: new Date()
    });

    const resp = await query({
      query: GET_TODAYS_CHUNKS
    });

    expect(resp.data).toBeFalsy();
    expect(resp.errors[0].message).toEqual(
      "Start date and exam date were the same for Wrong."
    );

    const removeResp = await Exam.deleteOne({ _id: exam._id });
    expect(removeResp.deletedCount).toBe(1);
  });

  it("should not fetch today's chunks, since current page is higher than total amount of pages (however should never occur)", async () => {
    const exam = await addTestExam({
      subject: "Wrong",
      currentPage: 50,
      numberPages: 20,
      timesRepeat: 1
    });

    const resp = await query({
      query: GET_TODAYS_CHUNKS
    });

    expect(resp.data).toBeFalsy();
    expect(resp.errors[0].message).toEqual(
      "The current page is higher than the number of pages for this exam."
    );

    const removeResp = await Exam.deleteOne({ _id: exam._id });
    expect(removeResp.deletedCount).toBe(1);
  });

  async function addTestExams() {
    const exam1 = await addTestExam({
      subject: "Biology"
    });
    const exam2 = await addTestExam({
      subject: "Archeology",
      examDate: getFutureDay(new Date(), 2),
      startDate: getFutureDay(new Date(), -5),
      numberPages: 42,
      timePerPage: 10,
      startPage: 7,
      currentPage: 50,
      timesRepeat: 2
    });
    const exam3 = await addTestExam({
      subject: "Chemistry",
      examDate: getFutureDay(new Date(), 1),
      startDate: getFutureDay(new Date(), -20),
      numberPages: 600,
      timePerPage: 10,
      startPage: 8,
      currentPage: 1600,
      timesRepeat: 5
    });
    const exam4 = await addTestExam({
      subject: "Dance",
      examDate: getFutureDay(new Date(), 30),
      startDate: getFutureDay(new Date(), 51)
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
    timesRepeat
  }) {
    //TODO: WHEN EXAMDATE AND STARTDATE THE SAME - GET INFINITY NUMBER PAGES - MAKE SURE IT DOESN'T HAPPEN!!!!!
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
