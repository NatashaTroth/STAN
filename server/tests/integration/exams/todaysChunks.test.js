//https://www.apollographql.com/docs/apollo-server/testing/testing/
//https://mongoosejs.com/docs/jest.html
import { createTestClient } from "apollo-server-testing";
import {
  setupApolloServer,
  setupDb,
  addTestExam,
  addTestExams,
  clearDatabase,
  teardown,
  getFutureDay
} from "../setup";
import { TodaysChunkCache, Exam } from "../../../models";
import { todaysChunkCacheEmpty } from "../../../helpers/chunks";

import { GET_TODAYS_CHUNKS } from "../../queries.js";

//TODO: ADD THIS TO THIS TEST TOO?
import {
  EXAM_COMPLETED_MUTATION,
  UPDATE_CURRENT_PAGE_MUTATION,
  UPDATE_EXAM_MUTATION
} from "../../mutations.js";

// import { createTestClient } from "apollo-server-integration-testing";

describe("Test user resolver regex", () => {
  let server;
  let query;
  let mutate;
  let testExams;

  beforeAll(async () => {
    await setupDb();
    server = await setupApolloServer({ isAuth: true, userId: "samanthasId" });
    let client = createTestClient(server);
    query = client.query;
    mutate = client.mutate;
  });

  afterEach(async () => {
    await clearDatabase();
  });

  afterAll(async () => {
    await teardown();
  });

  it("should correctly fetch today's chunks", async () => {
    testExams = await addTestExams();

    // const { exam1, exam2, exam3, exam4 } = addTestExams();
    // const exam1 = aaddTestExams();
    // console.log(testExams);

    const resp = await query({
      query: GET_TODAYS_CHUNKS
    });
    // console.log(resp);
    // console.log(JSON.stringify(resp));
    // console.log(resp.data.todaysChunks[0].exam);
    // console.log(resp);
    expect(resp.data.todaysChunks).toBeTruthy();
    expect(resp.data.todaysChunks.length).toBe(3);

    // resp.data.todaysChunks[0].examDate.
    // resp.data.todaysChunks[2].exam.id.toString();
    expect(resp.data.todaysChunks[2]).toMatchObject({
      exam: {
        id: testExams.exam1._id.toString(),
        subject: testExams.exam1.subject,
        examDate: testExams.exam1.examDate,
        startDate: testExams.exam1.startDate,
        totalNumberDays: testExams.exam1.totalNumberDays,
        numberPages: testExams.exam1.numberPages,
        timesRepeat: testExams.exam1.timesRepeat,
        currentPage: testExams.exam1.currentPage,
        pdfLink: testExams.exam1.pdfLink
      },
      numberPagesToday: 10,
      durationToday: 50,
      daysLeft: 5,

      notEnoughTime: false
    });

    expect(resp.data.todaysChunks[1]).toMatchObject({
      exam: {
        id: testExams.exam2._id.toString(),
        subject: testExams.exam2.subject,
        examDate: testExams.exam2.examDate,
        startDate: testExams.exam2.startDate,
        totalNumberDays: testExams.exam2.totalNumberDays,
        numberPages: testExams.exam2.numberPages,
        timesRepeat: testExams.exam2.timesRepeat,
        currentPage: testExams.exam2.currentPage,
        pdfLink: testExams.exam2.pdfLink
      },
      numberPagesToday: 18,
      durationToday: 180,
      daysLeft: 2,

      notEnoughTime: false
    });

    expect(resp.data.todaysChunks[0]).toMatchObject({
      exam: {
        id: testExams.exam3._id.toString(),
        subject: testExams.exam3.subject,
        examDate: testExams.exam3.examDate,
        startDate: testExams.exam3.startDate,
        totalNumberDays: testExams.exam3.totalNumberDays,
        numberPages: testExams.exam3.numberPages,
        timesRepeat: testExams.exam3.timesRepeat,
        currentPage: testExams.exam3.currentPage,
        pdfLink: testExams.exam3.pdfLink
      },
      numberPagesToday: 41,
      durationToday: 410,
      daysLeft: 1,

      notEnoughTime: false
    });
  });

  it("should detect if the todays chunks cache for this user is empty", async () => {
    testExams = await addTestExams();

    const respDeleteTodaysChunksCache = await TodaysChunkCache.deleteMany({
      userId: "samanthasId"
    });
    expect(respDeleteTodaysChunksCache).toBeTruthy();
    expect(await TodaysChunkCache.countDocuments()).toBe(0);
    const resp = await todaysChunkCacheEmpty("samanthasId");
    expect(resp).toBeTruthy();

    const respFetchChunks = await query({
      query: GET_TODAYS_CHUNKS
    });
    expect(respFetchChunks.data.todaysChunks).toBeTruthy();
    expect(respFetchChunks.data.todaysChunks.length).toBe(3);

    expect(
      await TodaysChunkCache.countDocuments({ userId: "samanthasId" })
    ).toBe(3);

    const resp2 = await todaysChunkCacheEmpty("samanthasId");

    expect(resp2).toBeFalsy();
  });

  it("todaysChunks should be empty, since no exams", async () => {
    expect(await TodaysChunkCache.countDocuments()).toBe(0);
    expect(await Exam.countDocuments()).toBe(0);

    const respFetchChunks = await query({
      query: GET_TODAYS_CHUNKS
    });
    expect(respFetchChunks.data.todaysChunks).toBeTruthy();
    expect(respFetchChunks.data.todaysChunks.length).toBe(0);
  });

  it("todaysChunks should be empty when exam is completed", async () => {
    const testExam = await addTestExam({
      subject: "Biology",
      completed: false
    });
    expect(await TodaysChunkCache.countDocuments()).toBe(0);
    expect(await Exam.countDocuments()).toBe(1);

    const respFetchChunks = await query({
      query: GET_TODAYS_CHUNKS
    });
    expect(respFetchChunks.data.todaysChunks).toBeTruthy();
    expect(respFetchChunks.data.todaysChunks.length).toBe(1);
    expect(respFetchChunks.data.todaysChunks[0].completed).toBeFalsy();

    const respExamCompleted = await query({
      query: EXAM_COMPLETED_MUTATION,
      variables: {
        id: testExam._id.toString()
      }
    });
    expect(respExamCompleted.data).toBeTruthy();

    const completedExam = await Exam.findOne({ _id: testExam._id.toString() });
    expect(completedExam.completed).toBeTruthy();

    const respFetchChunks2 = await query({
      query: GET_TODAYS_CHUNKS
    });
    expect(respFetchChunks2.data.todaysChunks).toBeTruthy();
    expect(respFetchChunks2.data.todaysChunks.length).toBe(0);
    // expect(respFetchChunks2.data.todaysChunks[0].completed).toBeTruthy();
  });

  it.skip("todaysChunks should update when exam is updated", async () => {
    const testExam = await addTestExam({
      subject: "Biology"
    });
    expect(await TodaysChunkCache.countDocuments()).toBe(0);
    expect(await Exam.countDocuments()).toBe(1);

    const respFetchChunks = await query({
      query: GET_TODAYS_CHUNKS
    });
    expect(respFetchChunks.data.todaysChunks).toBeTruthy();
    expect(respFetchChunks.data.todaysChunks.length).toBe(1);
    expect(respFetchChunks.data.todaysChunks[0].exam.currentPage).toBe(1);

    //update currentpage to 3
    const updateResp = await mutate({
      query: UPDATE_CURRENT_PAGE_MUTATION,
      variables: {
        examId: testExam._id.toString(),
        page: 3
      }
    });
    expect(updateResp.data.updateCurrentPage).toBeTruthy();
    const respFetchChunks2 = await query({
      query: GET_TODAYS_CHUNKS
    });
    console.log(respFetchChunks2);
    expect(respFetchChunks2.data.todaysChunks).toBeTruthy();
    expect(respFetchChunks2.data.todaysChunks.length).toBe(1);
    expect(respFetchChunks2.data.todaysChunks[0].exam.currentPage).toBe(3);

    // const newCurrentPageObject = { ...testExam };
    // newCurrentPageObject.currentPage = 3;
    expect(respFetchChunks2.data.todaysChunks[0]).toMatchObject({
      exam: {
        id: testExam._id.toString(),
        subject: testExam.subject,
        examDate: testExam.examDate,
        startDate: testExam.startDate,
        totalNumberDays: testExam.totalNumberDays,
        numberPages: testExam.numberPages,
        timesRepeat: testExam.timesRepeat,
        currentPage: 3,
        pdfLink: testExam.pdfLink
      },
      numberPagesToday: respFetchChunks.data.todaysChunks[0].numberPagesToday,
      startPage: respFetchChunks.data.todaysChunks[0].startPage, //TODO: or 23???
      currentPage: 3,
      durationToday: respFetchChunks.data.todaysChunks[0].durationToday,
      daysLeft: respFetchChunks.data.todaysChunks[0].daysLeft,
      notEnoughTime: false
    });

    //update exam
    const respUpdateExam = await mutate({
      query: UPDATE_EXAM_MUTATION,
      variables: {
        id: testExam._id.toString(),
        subject: testExam.subject,
        examDate: getFutureDay(testExam.examDate, 2),
        startDate: testExam.startDate,
        currentPage: 23,
        numberPages: 200, //was 50
        timePerPage: 5,
        startPage: 20,
        timesRepeat: 1
      }
    });

    expect(respUpdateExam.data.updateExam).toBeTruthy();
    const respFetchChunks3 = await query({
      query: GET_TODAYS_CHUNKS
    });

    expect(respFetchChunks3.data.todaysChunks).toBeTruthy();
    expect(respFetchChunks3.data.todaysChunks.length).toBe(1);
    expect(respFetchChunks3.data.todaysChunks[0]).toMatchObject({
      exam: {
        id: testExam._id.toString(),
        subject: testExam.subject,
        examDate: getFutureDay(testExam.examDate, 2),
        startDate: testExam.startDate,
        totalNumberDays: testExam.totalNumberDays + 2,
        numberPages: 200,
        timesRepeat: 1,
        currentPage: 23,
        pdfLink: testExam.pdfLink
      },
      numberPagesToday: 27,
      startPage: 23, //TODO: or 23???
      currentPage: 23,
      durationToday: 135,
      daysLeft: 7,
      notEnoughTime: false
    });

    //update Exam again - current progress should still be included
    const respUpdateExam2 = await mutate({
      query: UPDATE_EXAM_MUTATION,
      variables: {
        id: testExam._id.toString(),
        subject: testExam.subject,
        examDate: getFutureDay(testExam.examDate, 1),
        startDate: testExam.startDate,
        currentPage: 23,
        numberPages: 200, //was 50
        timePerPage: 5,
        startPage: 20,
        timesRepeat: 1
      }
    });

    expect(respUpdateExam2.data.updateExam).toBeTruthy();
    const respFetchChunks4 = await query({
      query: GET_TODAYS_CHUNKS
    });

    expect(respFetchChunks4.data.todaysChunks).toBeTruthy();
    expect(respFetchChunks4.data.todaysChunks.length).toBe(1);
    expect(respFetchChunks4.data.todaysChunks[0]).toMatchObject({
      exam: {
        id: testExam._id.toString(),
        subject: testExam.subject,
        examDate: getFutureDay(testExam.examDate, 1),
        startDate: testExam.startDate,
        totalNumberDays: testExam.totalNumberDays + 1,
        numberPages: 200,
        timesRepeat: 1,
        currentPage: 23,
        pdfLink: testExam.pdfLink
      },
      numberPagesToday: 32,
      startPage: 23, //TODO: or 23???
      currentPage: 23,
      durationToday: 160,
      daysLeft: 6,
      notEnoughTime: false
    });
  });

  it.skip("only unimportant stuff should update (currentPage, notes, link..), chunk calculations should stay the same", async () => {
    const testExam = await addTestExam({
      subject: "Biology"
    });
    expect(await TodaysChunkCache.countDocuments()).toBe(0);
    expect(await Exam.countDocuments()).toBe(1);

    const respFetchChunks = await query({
      query: GET_TODAYS_CHUNKS
    });
    // expect(respFetchChunks.data.todaysChunks).toBeTruthy();
    // expect(respFetchChunks.data.todaysChunks.length).toBe(1);
    // expect(respFetchChunks.data.todaysChunks[0].exam.currentPage).toBe(1);

    // //update currentpage to 3
    // const updateResp = await mutate({
    //   query: UPDATE_CURRENT_PAGE_MUTATION,
    //   variables: {
    //     examId: testExam._id.toString(),
    //     page: 3
    //   }
    // });
    // expect(updateResp.data.updateCurrentPage).toBeTruthy();
    // const respFetchChunks2 = await query({
    //   query: GET_TODAYS_CHUNKS
    // });
    // console.log(respFetchChunks2);
    // expect(respFetchChunks2.data.todaysChunks).toBeTruthy();
    // expect(respFetchChunks2.data.todaysChunks.length).toBe(1);
    // expect(respFetchChunks2.data.todaysChunks[0].exam.currentPage).toBe(3);

    //update current page to last page
    const updateResp2 = await mutate({
      query: UPDATE_CURRENT_PAGE_MUTATION,
      variables: {
        examId: testExam._id.toString(),
        page: 11
      }
    });
    expect(updateResp2.data.updateCurrentPage).toBeTruthy();
    const respFetchChunks3 = await query({
      query: GET_TODAYS_CHUNKS
    });
    console.log(respFetchChunks3.data.todaysChunks);
    expect(respFetchChunks3.data.todaysChunks).toBeTruthy();
    expect(respFetchChunks3.data.todaysChunks.length).toBe(1);
    expect(respFetchChunks3.data.todaysChunks[0].exam.currentPage).toBe(3);
    expect(respFetchChunks3.data.todaysChunks[0].startPage).toBe(1);

    //#TODO
    // expect(respFetchChunks3.data.todaysChunks[0].completed).toBeTruthy();
  });

  //TODO:
  // it("todaysChunks should be empty when chunk is completed", async () => {
  //   const testExam = await addTestExam({
  //     subject: "Biology"
  //   });
  //   expect(await TodaysChunkCache.countDocuments()).toBe(0);
  //   expect(await Exam.countDocuments()).toBe(1);

  //   const respFetchChunks = await query({
  //     query: GET_TODAYS_CHUNKS
  //   });
  //   expect(respFetchChunks.data.todaysChunks).toBeTruthy();
  //   expect(respFetchChunks.data.todaysChunks.length).toBe(1);
  //   expect(respFetchChunks.data.todaysChunks[0].completed).toBeFalsy();

  //   const respExamCompleted = await query({
  //     query: EXAM_COMPLETED_MUTATION,
  //     variables: {
  //       id: testExam._id.toString()
  //     }
  //   });
  //   expect(respExamCompleted.data).toBeTruthy();

  //   const completedExam = await Exam.findOne({ _id: testExam._id.toString() });
  //   expect(completedExam.completed).toBeTruthy();

  //   const respFetchChunks2 = await query({
  //     query: GET_TODAYS_CHUNKS
  //   });
  //   expect(respFetchChunks2.data.todaysChunks).toBeTruthy();
  //   expect(respFetchChunks2.data.todaysChunks.length).toBe(1);
  //   expect(respFetchChunks2.data.todaysChunks[0].completed).toBeTruthy();
  // });
});
