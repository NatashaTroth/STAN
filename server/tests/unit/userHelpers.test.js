import { userWantsPasswordUpdating } from "../../helpers/userHelpers";

test("verifies numberOfDaysLeft", () => {
  expect(userWantsPasswordUpdating("test1", "test2")).toBeTruthy();
  expect(userWantsPasswordUpdating("test1", "")).toBeTruthy();
  expect(userWantsPasswordUpdating("test1", null)).toBeTruthy();
  expect(userWantsPasswordUpdating("", "test2")).toBeTruthy();
  expect(userWantsPasswordUpdating(null, "test2")).toBeTruthy();
  expect(userWantsPasswordUpdating("", "")).toBeFalsy();
  expect(userWantsPasswordUpdating(null, null)).toBeFalsy();
});
