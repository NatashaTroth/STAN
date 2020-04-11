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

import { GET_CALENDAR_CHUNKS } from "../../queries.js";
import { fetchCalendarChunks } from "../../../helpers/examHelpers";

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
    const resp = await query({
      query: GET_CALENDAR_CHUNKS
    });
    // console.log(JSON.stringify(resp));

    expect(resp.data.calendarChunks).toBeTruthy();
    expect(resp.data.calendarChunks.length).toBe(3);

    // expect(resp.data.todaysChunks[2]).toMatchObject({
    //   exam: {
    //     id: testExams.exam1._id.toString(),
    //     subject: testExams.exam1.subject,
    //     examDate: testExams.exam1.examDate,
    //     startDate: testExams.exam1.startDate,
    //     numberPages: testExams.exam1.numberPages,
    //     timesRepeat: testExams.exam1.timesRepeat,
    //     currentPage: testExams.exam1.currentPage,
    //     pdfLink: testExams.exam1.pdfLink
    //   },
    //   numberPagesToday: 10,
    //   duration: 50,
    //   daysLeft: 5,
    //   totalNumberDays: 5,
    //   numberPagesWithRepeat: 50,
    //   notEnoughTime: false
    // });
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
