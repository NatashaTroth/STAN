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
  GET_TODAYS_CHUNKS,
  GET_EXAMS_QUERY,
  GET_EXAM_QUERY
} from "../../queries.js";
import { UPDATE_CURRENT_PAGE_MUTATION } from "../../mutations.js";

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

  afterEach(async () => {
    await clearDatabase();
  });

  afterAll(async () => {
    await teardown();
  });

  it("should fetch the test exam", async () => {
    // const { exam1, exam2, exam3, exam4 } = addTestExams();
    // const exam1 = aaddTestExams();
    // console.log(testExams);

    const resp = await query({
      query: GET_TODAYS_CHUNKS
    });
    console.log(JSON.stringify(resp));

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

    // expect(testExams.exam1).toEqual(
    //   expect.objectContaining({
    //     exam: {
    //       id: "5e8f6e50e7c2eb5dae5ada5f",
    //       subject: "Biology",
    //       examDate: "2020-04-14T18:49:52.022Z",
    //       startDate: "2020-04-09T18:49:52.045Z",
    //       numberPages: 50,
    //       timesRepeat: 1,
    //       currentPage: 1,
    //       pdfLink: "samanthas-link.stan"
    //     },
    //     numberPagesToday: 10,
    //     duration: 50,
    //     daysLeft: 5,
    //     totalNumberDays: 5,
    //     numberPagesWithRepeat: 50,
    //     notEnoughTime: false
    //   })
    // );

    // expect(exam.subject).toBe(resp.data.exam.subject);
    // expect(exam.examDate.toString()).toBe(resp.data.exam.examDate.toString());
    // expect(exam.startDate.toString()).toBe(resp.data.exam.startDate.toString());
    // expect(exam.numberPages).toBe(resp.data.exam.numberPages);
    // expect(exam.timePerPage).toBe(resp.data.exam.timePerPage);
    // expect(exam.timesRepeat).toBe(resp.data.exam.timesRepeat);
    // expect(exam.startPage).toBe(resp.data.exam.startPage);
    // expect(exam.currentPage).toBe(resp.data.exam.currentPage);
    // expect(exam.pdfLink).toBe(resp.data.exam.pdfLink);
    // expect(exam.notes).toBe(resp.data.exam.notes);
    // expect(exam.completed).toBe(resp.data.exam.completed);
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
      timesRepeat: 2
    });
    const exam3 = await addTestExam({
      subject: "Chemistry",
      examDate: getFutureDay(new Date(), 1),
      startDate: getFutureDay(new Date(), -20),
      numberPages: 600,
      timePerPage: 10,
      startPage: 8,
      timesRepeat: 5
    });
    const exam4 = await addTestExam({
      subject: "Dance",
      examDate: getFutureDay(new Date(), 30),
      startDate: getFutureDay(new Date(), 51),
      numberPages: 600,
      timePerPage: 10,
      startPage: 8,
      timesRepeat: 5
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
      currentPage: startPage,
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
    console.log(nextDay);
    nextDay.setDate(date.getDate() + numberDaysInFuture);
    console.log(nextDay);

    return new Date(nextDay);
  }
});
