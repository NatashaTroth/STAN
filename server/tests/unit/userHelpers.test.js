import { userWantsPasswordUpdating } from "../../helpers/users/userHelpers";

test("verifies numberOfDaysLeft", () => {
  expect(userWantsPasswordUpdating("test1", "test2")).toBeTruthy();
  expect(userWantsPasswordUpdating("test1", "")).toBeTruthy();
  expect(userWantsPasswordUpdating("test1", null)).toBeTruthy();
  expect(userWantsPasswordUpdating("", "test2")).toBeTruthy();
  expect(userWantsPasswordUpdating(null, "test2")).toBeTruthy();
  expect(userWantsPasswordUpdating("", "")).toBeFalsy();
  expect(userWantsPasswordUpdating(null, null)).toBeFalsy();
});

// test("verifies numberOfDaysLeft", () => {
//   expect(userWantsPasswordUpdating("test1", "test2")).toBeTruthy();
//   expect(userWantsPasswordUpdating("test1", "")).toBeFalsy();
//   expect(userWantsPasswordUpdating("test1", null)).toBeFalsy();
//   expect(userWantsPasswordUpdating("", "test2")).toBeFalsy();
//   expect(userWantsPasswordUpdating(null, "test2")).toBeFalsy();
//   expect(userWantsPasswordUpdating("", "")).toBeFalsy();
//   expect(userWantsPasswordUpdating(null, null)).toBeFalsy();
//   expect(userWantsPasswordUpdating(undefined, undefined)).toBeFalsy();
// });
