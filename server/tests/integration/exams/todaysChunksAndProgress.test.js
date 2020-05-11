//https://www.apollographql.com/docs/apollo-server/testing/testing/
//https://mongoosejs.com/docs/jest.html
import { createTestClient } from "apollo-server-testing";
import {
  setupApolloServer,
  setupDb,
  addTestExam,
  // addTestExams,
  clearDatabase,
  teardown,
  getFutureDay
} from "../setup";
import { TodaysChunkCache, Exam } from "../../../models";
// import { todaysChunkCacheEmpty } from "../../../helpers/chunks";

import { GET_TODAYS_CHUNKS_AND_PROGRESS } from "../../queries.js";

//TODO: ADD THIS TO THIS TEST TOO?
import {
  EXAM_COMPLETED_MUTATION,
  UPDATE_CURRENT_PAGE_MUTATION,
  UPDATE_EXAM_MUTATION
} from "../../mutations.js";

import { isTheSameDay } from "../../../helpers/dates";

// import { createTestClient } from "apollo-server-integration-testing";

describe("Test user resolver regex", () => {
  let server;
  let query;
  let mutate;

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

  it("should correctly fetch today's chunk - also after updating", async () => {
    const testExam = await addTestExam({ subject: "Biology" });
    const chunkStartPage = testExam.currentPage;
    expect(
      await TodaysChunkCache.countDocuments({
        userId: "samanthasId"
      })
    ).toBe(0);

    //---CHECK TODAYSCACHE---
    let respTodaysChunks = await query({
      query: GET_TODAYS_CHUNKS_AND_PROGRESS
    });
    expect(respTodaysChunks.data.todaysChunkAndProgress).toBeTruthy();
    expect(
      respTodaysChunks.data.todaysChunkAndProgress.todaysChunks.length
    ).toBe(1);

    expect(
      await TodaysChunkCache.countDocuments({
        userId: "samanthasId"
      })
    ).toBe(1);

    expect(respTodaysChunks.data.todaysChunkAndProgress).toMatchObject({
      todaysChunks: [
        {
          exam: {
            id: testExam._id.toString(),
            subject: testExam.subject,
            examDate: testExam.examDate,
            startDate: testExam.startDate,
            totalNumberDays: testExam.totalNumberDays,
            timePerPage: testExam.timePerPage,
            numberPages: testExam.numberPages,
            timesRepeat: testExam.timesRepeat,
            currentPage: testExam.currentPage,
            studyMaterialLinks: [testExam.studyMaterialLinks[0].toString()]
          },
          numberPagesToday: 10,
          startPage: chunkStartPage,
          durationToday: 50,
          durationLeftToday: 50,
          daysLeft: 5,
          completed: false
        }
      ],
      todaysProgress: 0
      // notEnoughTime: false
    });

    //---CHECK DB TODAYSCACHE---
    let todaysChunkCacheDb = await TodaysChunkCache.findOne({
      userId: "samanthasId",
      examId: testExam._id.toString()
    });
    expect(todaysChunkCacheDb).toBeTruthy();
    expect(todaysChunkCacheDb).toMatchObject({
      numberPagesToday: 10,
      durationToday: 50,
      startPage: testExam.currentPage,
      currentPage: testExam.currentPage,
      daysLeft: 5,
      durationAlreadyLearned: 0,
      completed: false
    });
    const dateInTodaysChunkCacheDb = new Date(todaysChunkCacheDb.updatedAt);

    expect(isTheSameDay(dateInTodaysChunkCacheDb, new Date())).toBeTruthy();

    //---UPDATE CURRENT PAGE---
    const updatePageResp1 = await mutate({
      query: UPDATE_CURRENT_PAGE_MUTATION,
      variables: {
        examId: testExam._id.toString(),
        page: 3
      }
    });
    expect(updatePageResp1.data.updateCurrentPage).toBeTruthy();
    todaysChunkCacheDb = await TodaysChunkCache.findOne({
      userId: "samanthasId",
      examId: testExam._id.toString()
    });
    expect(todaysChunkCacheDb).toBeTruthy();
    expect(todaysChunkCacheDb).toMatchObject({
      numberPagesToday: 10,
      durationToday: 50,
      startPage: chunkStartPage,
      currentPage: 3,
      daysLeft: 5,
      durationAlreadyLearned: 0,
      completed: false
    });
    let exam = await Exam.findOne({
      userId: "samanthasId",
      subject: "Biology"
    });
    expect(exam).toBeTruthy();
    expect(exam.currentPage).toBe(3);

    //---REFETCH TODAYSCHUNKS---
    respTodaysChunks = await query({
      query: GET_TODAYS_CHUNKS_AND_PROGRESS
    });
    expect(respTodaysChunks.data.todaysChunkAndProgress).toBeTruthy();
    expect(
      respTodaysChunks.data.todaysChunkAndProgress.todaysChunks.length
    ).toBe(1);

    expect(
      await TodaysChunkCache.countDocuments({
        userId: "samanthasId"
      })
    ).toBe(1);

    expect(respTodaysChunks.data.todaysChunkAndProgress).toMatchObject({
      todaysChunks: [
        {
          exam: {
            id: testExam._id.toString(),
            subject: testExam.subject,
            examDate: testExam.examDate,
            startDate: testExam.startDate,
            totalNumberDays: testExam.totalNumberDays,
            timePerPage: testExam.timePerPage,
            numberPages: testExam.numberPages,
            timesRepeat: testExam.timesRepeat,
            currentPage: 3,
            studyMaterialLinks: [testExam.studyMaterialLinks[0].toString()]
          },
          numberPagesToday: 10,
          startPage: chunkStartPage,
          durationToday: 50,
          durationLeftToday: 40,
          daysLeft: 5,
          completed: false
        }
      ],
      todaysProgress: 20
    });

    //---UPDATE CURRENT PAGE (Update Exam Mutation - update unimportant things as well)---
    testExam.subject = "English";
    testExam.notes = "Teting";
    testExam.studyMaterialLinks = ["testingLink.at"];
    const updateResp2 = await mutate({
      query: UPDATE_EXAM_MUTATION,
      variables: {
        id: testExam._id.toString(),
        subject: testExam.subject,
        examDate: testExam.examDate,
        startDate: testExam.startDate,
        currentPage: 5,
        numberPages: testExam.numberPages, //was 50
        timePerPage: testExam.timePerPage,
        startPage: testExam.startPage,
        timesRepeat: testExam.timesRepeat,
        notes: testExam.notes,
        studyMaterialLinks: [testExam.studyMaterialLinks[0].toString()]
      }
    });

    expect(updateResp2.data.updateExam).toBeTruthy();
    todaysChunkCacheDb = await TodaysChunkCache.findOne({
      userId: "samanthasId",
      examId: testExam._id.toString()
    });
    expect(todaysChunkCacheDb).toBeTruthy();
    expect(todaysChunkCacheDb).toMatchObject({
      numberPagesToday: 10,
      durationToday: 50,
      startPage: chunkStartPage,
      currentPage: 5,
      daysLeft: 5,
      durationAlreadyLearned: 0,
      completed: false
    });
    exam = await Exam.findOne({
      userId: "samanthasId",
      subject: testExam.subject
    });
    expect(exam).toBeTruthy();
    expect(exam.currentPage).toBe(5);

    //---REFETCH TODAYSCHUNKS---
    respTodaysChunks = await query({
      query: GET_TODAYS_CHUNKS_AND_PROGRESS
    });
    expect(respTodaysChunks.data.todaysChunkAndProgress).toBeTruthy();
    expect(
      respTodaysChunks.data.todaysChunkAndProgress.todaysChunks.length
    ).toBe(1);

    expect(
      await TodaysChunkCache.countDocuments({
        userId: "samanthasId"
      })
    ).toBe(1);

    expect(respTodaysChunks.data.todaysChunkAndProgress).toMatchObject({
      todaysChunks: [
        {
          exam: {
            id: testExam._id.toString(),
            subject: testExam.subject,
            examDate: testExam.examDate,
            startDate: testExam.startDate,
            totalNumberDays: testExam.totalNumberDays,
            timePerPage: testExam.timePerPage,
            numberPages: testExam.numberPages,
            timesRepeat: testExam.timesRepeat,
            currentPage: 5,
            studyMaterialLinks: [testExam.studyMaterialLinks[0].toString()]
          },
          numberPagesToday: 10,
          startPage: chunkStartPage,
          durationToday: 50,
          durationLeftToday: 30,
          daysLeft: 5,
          completed: false
        }
      ],
      todaysProgress: 40
    });

    //---UPDATE EXAM (recalc Chunks))---
    testExam.examDate = getFutureDay(new Date(), 6);
    testExam.currentPage = 7;
    testExam.numberPages = 20;
    testExam.timePerPage = 10;
    testExam.startPage = 2;
    testExam.timesRepeat = 2;
    testExam.totalNumberDays = 6;
    const updateResp3 = await mutate({
      query: UPDATE_EXAM_MUTATION,
      variables: {
        id: testExam._id.toString(),
        subject: testExam.subject,
        examDate: testExam.examDate,
        startDate: testExam.startDate,
        currentPage: testExam.currentPage,
        numberPages: testExam.numberPages, //was 50
        timePerPage: testExam.timePerPage,
        startPage: testExam.startPage,
        timesRepeat: testExam.startPage
      }
    });

    expect(updateResp3.data.updateExam).toBeTruthy();
    todaysChunkCacheDb = await TodaysChunkCache.findOne({
      userId: "samanthasId",
      examId: testExam._id.toString()
    });
    expect(todaysChunkCacheDb).toBeTruthy();
    expect(todaysChunkCacheDb).toMatchObject({
      numberPagesToday: 5,
      durationToday: 50,
      startPage: 7,
      currentPage: 7,
      daysLeft: 6,
      durationAlreadyLearned: 20, //30 if you calc from new currentpage TODO
      completed: false
    });
    exam = await Exam.findOne({
      userId: "samanthasId",
      subject: testExam.subject
    });
    expect(exam).toBeTruthy();
    expect(exam.currentPage).toBe(7);

    //---REFETCH TODAYSCHUNKS---
    respTodaysChunks = await query({
      query: GET_TODAYS_CHUNKS_AND_PROGRESS
    });
    expect(respTodaysChunks.data.todaysChunkAndProgress).toBeTruthy();
    expect(
      respTodaysChunks.data.todaysChunkAndProgress.todaysChunks.length
    ).toBe(1);

    expect(
      await TodaysChunkCache.countDocuments({
        userId: "samanthasId"
      })
    ).toBe(1);

    expect(respTodaysChunks.data.todaysChunkAndProgress).toMatchObject({
      todaysChunks: [
        {
          exam: {
            id: testExam._id.toString(),
            subject: testExam.subject,
            examDate: testExam.examDate,
            startDate: testExam.startDate,
            totalNumberDays: testExam.totalNumberDays,
            timePerPage: testExam.timePerPage,
            numberPages: testExam.numberPages,
            timesRepeat: testExam.timesRepeat,
            currentPage: 7,
            studyMaterialLinks: [testExam.studyMaterialLinks[0].toString()]
          },
          numberPagesToday: 5,
          startPage: 7,
          durationToday: 50,
          durationLeftToday: 50,
          daysLeft: 6,
          completed: false
        }
      ],
      todaysProgress: 0 //TODO: SHOULD IT BE 0? - CAN CHANGE IT
    });

    //---UPDATE CURRENT PAGE TO COMPLETE CHUNK---
    const updatePageResp4 = await mutate({
      query: UPDATE_CURRENT_PAGE_MUTATION,
      variables: {
        examId: testExam._id.toString(),
        page: 13
      }
    });
    expect(updatePageResp4.data.updateCurrentPage).toBeTruthy();
    todaysChunkCacheDb = await TodaysChunkCache.findOne({
      userId: "samanthasId",
      examId: testExam._id.toString()
    });
    expect(todaysChunkCacheDb).toBeTruthy();
    expect(todaysChunkCacheDb).toMatchObject({
      numberPagesToday: 5,
      durationToday: 50,
      startPage: 7,
      currentPage: 13,
      daysLeft: 6,
      durationAlreadyLearned: 20,
      completed: true
    });
    exam = await Exam.findOne({
      userId: "samanthasId",
      subject: "English"
    });
    expect(exam).toBeTruthy();
    expect(exam.currentPage).toBe(13);

    //---REFETCH TODAYSCHUNKS---
    respTodaysChunks = await query({
      query: GET_TODAYS_CHUNKS_AND_PROGRESS
    });
    expect(respTodaysChunks.data.todaysChunkAndProgress).toBeTruthy();
    expect(
      respTodaysChunks.data.todaysChunkAndProgress.todaysChunks.length
    ).toBe(1);

    expect(
      await TodaysChunkCache.countDocuments({
        userId: "samanthasId"
      })
    ).toBe(1);

    expect(respTodaysChunks.data.todaysChunkAndProgress).toMatchObject({
      todaysChunks: [
        {
          exam: {
            id: testExam._id.toString(),
            subject: testExam.subject,
            examDate: testExam.examDate,
            startDate: testExam.startDate,
            totalNumberDays: testExam.totalNumberDays,
            timePerPage: testExam.timePerPage,
            numberPages: testExam.numberPages,
            timesRepeat: testExam.timesRepeat,
            currentPage: 13,
            studyMaterialLinks: [testExam.studyMaterialLinks[0].toString()]
          },
          numberPagesToday: 5,
          startPage: 7,
          durationToday: 50,
          durationLeftToday: 0,
          daysLeft: 6,
          completed: true
        }
      ],
      todaysProgress: 100
    });
  });

  it("should correctly fetch today's new chunks - on the next day", async () => {
    const testExam = await addTestExam({ subject: "Biology" });
    const chunkStartPage = testExam.currentPage;
    expect(
      await TodaysChunkCache.countDocuments({
        userId: "samanthasId"
      })
    ).toBe(0);

    //---CHECK TODAYSCACHE---
    let respTodaysChunks = await query({
      query: GET_TODAYS_CHUNKS_AND_PROGRESS
    });
    expect(respTodaysChunks.data.todaysChunkAndProgress).toBeTruthy();
    expect(
      respTodaysChunks.data.todaysChunkAndProgress.todaysChunks.length
    ).toBe(1);

    expect(
      await TodaysChunkCache.countDocuments({
        userId: "samanthasId"
      })
    ).toBe(1);

    expect(respTodaysChunks.data.todaysChunkAndProgress).toMatchObject({
      todaysChunks: [
        {
          exam: {
            id: testExam._id.toString(),
            subject: testExam.subject,
            examDate: testExam.examDate,
            startDate: testExam.startDate,
            totalNumberDays: testExam.totalNumberDays,
            timePerPage: testExam.timePerPage,
            numberPages: testExam.numberPages,
            timesRepeat: testExam.timesRepeat,
            currentPage: testExam.currentPage,
            studyMaterialLinks: [testExam.studyMaterialLinks[0].toString()]
          },
          numberPagesToday: 10,
          startPage: chunkStartPage,
          durationToday: 50,
          durationLeftToday: 50,
          daysLeft: 5,
          completed: false
        }
      ],
      todaysProgress: 0
      // notEnoughTime: false
    });

    //---UPDATE CURRENT PAGE---
    const updatePageResp1 = await mutate({
      query: UPDATE_CURRENT_PAGE_MUTATION,
      variables: {
        examId: testExam._id.toString(),
        page: 3
      }
    });
    expect(updatePageResp1.data.updateCurrentPage).toBeTruthy();

    //---REFETCH TODAYSCHUNKS---
    respTodaysChunks = await query({
      query: GET_TODAYS_CHUNKS_AND_PROGRESS
    });
    expect(respTodaysChunks.data.todaysChunkAndProgress).toBeTruthy();
    expect(
      respTodaysChunks.data.todaysChunkAndProgress.todaysChunks.length
    ).toBe(1);

    expect(
      await TodaysChunkCache.countDocuments({
        userId: "samanthasId"
      })
    ).toBe(1);

    expect(respTodaysChunks.data.todaysChunkAndProgress).toMatchObject({
      todaysChunks: [
        {
          exam: {
            id: testExam._id.toString(),
            subject: testExam.subject,
            examDate: testExam.examDate,
            startDate: testExam.startDate,
            totalNumberDays: testExam.totalNumberDays,
            timePerPage: testExam.timePerPage,
            numberPages: testExam.numberPages,
            timesRepeat: testExam.timesRepeat,
            currentPage: 3,
            studyMaterialLinks: [testExam.studyMaterialLinks[0].toString()]
          },
          numberPagesToday: 10,
          startPage: chunkStartPage,
          durationToday: 50,
          durationLeftToday: 40,
          daysLeft: 5,
          completed: false
        }
      ],
      todaysProgress: 20
    });

    //--UPDATE UPDATEDAT DATE IN TODAYSCACHE DATABASE
    const updateDateResp = await TodaysChunkCache.updateOne(
      { userId: "samanthasId", examId: testExam._id.toString() },
      { updatedAt: getFutureDay(new Date(), -1) }
    );
    expect(updateDateResp.ok).toBe(1);
    expect(updateDateResp.nModified).toBe(1);

    //---REFETCH TODAYSCHUNKS---
    respTodaysChunks = await query({
      query: GET_TODAYS_CHUNKS_AND_PROGRESS
    });
    expect(respTodaysChunks.data.todaysChunkAndProgress).toBeTruthy();
    expect(
      respTodaysChunks.data.todaysChunkAndProgress.todaysChunks.length
    ).toBe(1);

    expect(
      await TodaysChunkCache.countDocuments({
        userId: "samanthasId"
      })
    ).toBe(1);

    expect(respTodaysChunks.data.todaysChunkAndProgress).toMatchObject({
      todaysChunks: [
        {
          exam: {
            id: testExam._id.toString(),
            subject: testExam.subject,
            examDate: testExam.examDate,
            startDate: testExam.startDate,
            totalNumberDays: testExam.totalNumberDays,
            timePerPage: testExam.timePerPage,
            numberPages: testExam.numberPages,
            timesRepeat: testExam.timesRepeat,
            currentPage: 3,
            studyMaterialLinks: [testExam.studyMaterialLinks[0].toString()]
          },
          numberPagesToday: 10, //newly calculated -> 47/5 days left = 9.4
          startPage: 3,
          durationToday: 50,
          durationLeftToday: 50, //now 50 instead of 40
          daysLeft: 5,
          completed: false
        }
      ],
      todaysProgress: 0 //now 0
    });

    //---CHECK DB TODAYSCACHE---
    let todaysChunkCacheDb = await TodaysChunkCache.findOne({
      userId: "samanthasId",
      examId: testExam._id.toString()
    });
    expect(todaysChunkCacheDb).toBeTruthy();
    expect(todaysChunkCacheDb).toMatchObject({
      numberPagesToday: 10,
      durationToday: 50,
      startPage: 3,
      currentPage: 3,
      daysLeft: 5,
      durationAlreadyLearned: 0,
      completed: false
    });
    const dateInTodaysChunkCacheDb = new Date(todaysChunkCacheDb.updatedAt);

    expect(isTheSameDay(dateInTodaysChunkCacheDb, new Date())).toBeTruthy();
  });

  //-------EXAM COMPLETED TESTS----------
  it("tests if finished exam deletes today's chunk cache from db ", async () => {
    const testExam1 = await addTestExam({ subject: "Biology" });
    const testExam2 = await addTestExam({ subject: "Chemistry" });
    const testExam3 = await addTestExam({ subject: "Dance" });
    await addTestExam({ subject: "English" });

    expect(
      await TodaysChunkCache.countDocuments({
        userId: "samanthasId"
      })
    ).toBe(0);

    //---CHECK TODAYSCACHE---
    let respTodaysChunks = await query({
      query: GET_TODAYS_CHUNKS_AND_PROGRESS
    });
    expect(respTodaysChunks.data.todaysChunkAndProgress).toBeTruthy();
    expect(
      respTodaysChunks.data.todaysChunkAndProgress.todaysChunks.length
    ).toBe(4);

    expect(
      await TodaysChunkCache.countDocuments({
        userId: "samanthasId"
      })
    ).toBe(4);

    //---UPDATE CURRENT PAGE---
    const updatePageResp1 = await mutate({
      query: UPDATE_CURRENT_PAGE_MUTATION,
      variables: {
        examId: testExam1._id.toString(),
        page: 52
      }
    });
    expect(updatePageResp1.data.updateCurrentPage).toBeTruthy();

    //---REFETCH TODAYSCHUNKS---
    respTodaysChunks = await query({
      query: GET_TODAYS_CHUNKS_AND_PROGRESS
    });
    expect(respTodaysChunks.data.todaysChunkAndProgress).toBeTruthy();
    expect(
      respTodaysChunks.data.todaysChunkAndProgress.todaysChunks.length
    ).toBe(3);

    expect(
      await TodaysChunkCache.countDocuments({
        userId: "samanthasId"
      })
    ).toBe(3);

    //---UPDATE EXAM (current page)---
    const respUpdateExam = await mutate({
      query: UPDATE_EXAM_MUTATION,
      variables: {
        id: testExam2._id.toString(),
        subject: testExam2.subject,
        examDate: testExam2.examDate,
        startDate: testExam2.startDate,
        currentPage: 52,
        numberPages: testExam2.numberPages, //was 50
        timePerPage: testExam2.timePerPage,
        startPage: testExam2.startPage,
        timesRepeat: testExam2.timesRepeat
      }
    });
    expect(respUpdateExam.data.updateExam).toBeTruthy();
    //---REFETCH TODAYSCHUNKS---
    respTodaysChunks = await query({
      query: GET_TODAYS_CHUNKS_AND_PROGRESS
    });
    expect(respTodaysChunks.data.todaysChunkAndProgress).toBeTruthy();
    expect(
      respTodaysChunks.data.todaysChunkAndProgress.todaysChunks.length
    ).toBe(2);

    expect(
      await TodaysChunkCache.countDocuments({
        userId: "samanthasId"
      })
    ).toBe(2);

    //---UPDATE EXAM (current page)---
    const respExamCompleted = await mutate({
      query: EXAM_COMPLETED_MUTATION,
      variables: {
        id: testExam3._id.toString()
      }
    });
    expect(respExamCompleted.data.examCompleted).toBeTruthy();

    //---REFETCH TODAYSCHUNKS---
    respTodaysChunks = await query({
      query: GET_TODAYS_CHUNKS_AND_PROGRESS
    });
    expect(respTodaysChunks.data.todaysChunkAndProgress).toBeTruthy();
    expect(
      respTodaysChunks.data.todaysChunkAndProgress.todaysChunks.length
    ).toBe(1);

    expect(
      await TodaysChunkCache.countDocuments({
        userId: "samanthasId"
      })
    ).toBe(1);

    //TODO- TEST IF FINISHING EXAM (IN EXAM COMPETED, THROUGH UPDATE CURRENTPAGE OR UPDATE EXAM ACTUALLY ALL DELETE THE CACHE)
  });
});
