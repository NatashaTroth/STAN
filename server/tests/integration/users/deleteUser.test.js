//https://www.apollographql.com/docs/apollo-server/testing/testing/
//https://mongoosejs.com/docs/jest.html
import "dotenv/config";
import { createTestClient } from "apollo-server-testing";
import {
  setupApolloServer,
  setupDb,
  signUpTestUser,
  clearDatabase,
  teardown
} from "../setup";
import { DELETE_USER_MUTATION } from "../../mutations.js";

import { GET_EXAMS_QUERY } from "../../queries.js";
import { User, Exam } from "../../../models";

describe("Test user sign up and login resolvers", () => {
  let server;
  let mutate;
  let query;
  let testUser;
  let client;

  beforeAll(async () => {
    await setupDb();
  });
  beforeEach(async () => {
    testUser = await signUpTestUser();
    server = await setupApolloServer({
      isAuth: true,
      userId: testUser._id,
      user: testUser
    });

    client = createTestClient(server);
    mutate = client.mutate;
    query = client.query;
  });

  afterEach(async () => {
    await clearDatabase();
  });

  afterAll(async () => {
    await clearDatabase();
    await teardown();
  });

  it("should logout & delete the current logged in user, as well as delete all their data (exams,  tokens...)", async () => {
    await addTestExams(testUser._id);

    //count number of users
    const initialCount = await User.countDocuments();
    const initialUser = await User.findOne({ _id: testUser._id.toString() });
    expect(initialUser).toBeTruthy();

    //count number of exams for this user
    const respExams = await query({
      query: GET_EXAMS_QUERY
    });
    expect(respExams.data.exams).toBeTruthy();
    expect(respExams.data.exams.length).toBe(4);

    //delete user and all of the user's data
    const respDelete = await mutate({
      query: DELETE_USER_MUTATION,
      variables: {
        id: testUser._id.toString()
      }
    });
    //check user was deleted
    expect(respDelete.data).toBeTruthy();
    const newCount = await User.countDocuments();
    expect(newCount).toBe(initialCount - 1);
    const userAfterDelete = await User.findOne({
      _id: testUser._id.toString()
    });
    expect(userAfterDelete).toBeFalsy();

    //check user's data was deleted
    const respExamsAfterDelete = await query({
      query: GET_EXAMS_QUERY
    });
    expect(respExamsAfterDelete.data.exams).toBeTruthy();
    expect(respExamsAfterDelete.data.exams.length).toBe(0);

    //check that a non existing user cannot be deleted (although normally the error would be "Unauthorised")
    const respDelete2 = await mutate({
      query: DELETE_USER_MUTATION,
      variables: {
        id: testUser._id.toString()
      }
    });
    expect(respDelete2.data.deleteUser).toBeFalsy();
    expect(respDelete2.errors[0].message).toEqual(
      "The user couldn't be deleted"
    );
  });

  it("should correctly logout & delete the current logged in user, even though they have no exams ", async () => {
    //count number of users
    const initialCount = await User.countDocuments();
    const initialUser = await User.findOne({ _id: testUser._id.toString() });
    expect(initialUser).toBeTruthy();

    //count number of exams for this user
    const respExams = await query({
      query: GET_EXAMS_QUERY
    });
    expect(respExams.data.exams).toBeTruthy();
    expect(respExams.data.exams.length).toBe(0);

    //delete user and all of the user's data
    const respDelete = await mutate({
      query: DELETE_USER_MUTATION,
      variables: {
        id: testUser._id.toString()
      }
    });
    //check user was deleted
    expect(respDelete.data).toBeTruthy();
    const newCount = await User.countDocuments();
    expect(newCount).toBe(initialCount - 1);
    const userAfterDelete = await User.findOne({
      _id: testUser._id.toString()
    });
    expect(userAfterDelete).toBeFalsy();
  });

  async function addTestExams(userId) {
    const exam1 = await addTestExam({
      subject: "Biology",
      color: "#979250",
      userId
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
      color: "#2444A8",
      userId
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
      color: "#2328A9",
      userId
    });
    const exam4 = await addTestExam({
      subject: "Dance",
      examDate: getFutureDay(new Date(), 30),
      startDate: getFutureDay(new Date(), 51),
      color: "#85625A",
      userId
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
    color,
    userId
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
      userId: userId || "samanthasId"
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
