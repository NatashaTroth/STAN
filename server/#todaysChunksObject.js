// {
//   "exam": {
//     "id": "5e988b6dfb66edc7290debb1",
//     "subject": "Maths",
//     "examDate": "2020-05-05T00:00:00.000Z",
//     "startDate": "2020-04-20T00:00:00.000Z",
//   "totalNumberDays": 15,

//     "numberPages": 53,
//     "timesRepeat": 1,
//     "studyMaterialLinks": "TODO: CHANGE LATER"
//   },
//   "numberPagesToday": 4,
//   "durationToday": 16,
//   "daysLeft": 15,
//   "notEnoughTime": false,
// }

// examId;
// userId;
// numberPagesToday;
// durationToday;
// startPage;
// currentPage;
// completed;
// createdAt;
// updatedAt;

// daysLeft;
// notEnoughTime;

// const totalNumberDays = getNumberOfDays(finalStartDate, finalExamDate);
// import { getNumberOfDays } from "../../../helpers/dates";

// it("should not fetch today's chunks, since dates are the same (however should never occur)", async () => {
//   const exam = await addTestExam({
//     subject: "Wrong",
//     examDate: new Date(),
//     startDate: new Date()
//   });

//   const resp = await query({
//     query: GET_TODAYS_CHUNKS
//   });

//   expect(resp.data).toBeFalsy();
//   expect(resp.errors[0].message).toEqual(
//     "Start date and exam date were the same for Wrong."
//   );

//   const removeResp = await Exam.deleteOne({ _id: exam._id });
//   expect(removeResp.deletedCount).toBe(1);
// });

// it("should not fetch today's chunks, since current page is higher than total amount of pages (however should never occur)", async () => {
//   const exam = await addTestExam({
//     subject: "Wrong",
//     currentPage: 50,
//     numberPages: 20,
//     timesRepeat: 1
//   });

//   const resp = await query({
//     query: GET_TODAYS_CHUNKS
//   });

//   expect(resp.data).toBeFalsy();
//   expect(resp.errors[0].message).toEqual(
//     "The current page is higher than the number of pages for this exam."
//   );

//   const removeResp = await Exam.deleteOne({ _id: exam._id });
//   expect(removeResp.deletedCount).toBe(1);
// });
