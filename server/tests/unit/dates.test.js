const {
  datesTimingIsValid,
  startDateIsActive,
  getNumberOfDays
} = require("../../helpers/dates");

test("verifies datesTimingIsValid", () => {
  expect(
    datesTimingIsValid(new Date("2020.12.01"), new Date("2021.12.01"))
  ).toBeTruthy();
  expect(
    datesTimingIsValid(new Date("2020.12.01"), new Date("2021.12.03"))
  ).toBeTruthy();
  expect(
    datesTimingIsValid(new Date("2120.12.01"), new Date("2221.12.03"))
  ).toBeTruthy();
  expect(
    datesTimingIsValid(new Date("2020.12.02"), new Date("2020.12.01"))
  ).toBeFalsy();
  expect(
    datesTimingIsValid(new Date("1920.12.01"), new Date("2021.12.01"))
  ).toBeFalsy();
  expect(
    datesTimingIsValid(new Date("2020.12.01"), new Date("1920.12.01"))
  ).toBeFalsy();
  expect(
    datesTimingIsValid(new Date("2020.12.01"), new Date("2020.12.01"))
  ).toBeFalsy();
});

test("verifies startDateIsActive", () => {
  expect(startDateIsActive(new Date("1990.12.01"))).toBeTruthy();
  expect(startDateIsActive(new Date(new Date() - 1))).toBeTruthy();
  expect(startDateIsActive(new Date())).toBeTruthy();
  expect(startDateIsActive(new Date("1990.12.01"))).toBeTruthy();
  expect(startDateIsActive(new Date(new Date() + 1))).toBeTruthy();
});

test("verifies numberOfDaysLeft", () => {
  expect(getNumberOfDays(new Date("2020.12.01"), new Date("2020.12.02"))).toBe(
    2
  );
  expect(getNumberOfDays(new Date("2020.12.05"), new Date("2020.12.10"))).toBe(
    6
  );
  expect(getNumberOfDays(new Date("2020-04-01"), new Date("2020-04-10"))).toBe(
    10
  );
});
