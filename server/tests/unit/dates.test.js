const {
  datesTimingIsValid,
  startDateIsActive,
  isTheSameDay,
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
  expect(startDateIsActive(getFutureDay(new Date(), -1))).toBeTruthy();
  expect(startDateIsActive(new Date())).toBeTruthy();
  expect(startDateIsActive(new Date("1990.12.01"))).toBeTruthy();
  expect(startDateIsActive(getFutureDay(new Date(), 1))).toBeFalsy();
});

test("verifies isTheSameDay", () => {
  expect(
    isTheSameDay(new Date("1990.12.01"), new Date("1990.12.01"))
  ).toBeTruthy();
  expect(
    isTheSameDay(new Date("1990.12.05"), new Date("1990.12.01"))
  ).toBeFalsy();
});

test("verifies numberOfDaysLeft", () => {
  expect(getNumberOfDays(new Date("2020.12.01"), new Date("2020.12.02"))).toBe(
    1
  );
  expect(getNumberOfDays(new Date("2020.12.05"), new Date("2020.12.10"))).toBe(
    5
  );
  expect(getNumberOfDays(new Date("2020-04-01"), new Date("2020-04-10"))).toBe(
    9
  );
});

function getFutureDay(date, numberDaysInFuture) {
  const nextDay = new Date(date);
  nextDay.setDate(date.getDate() + numberDaysInFuture);
  return new Date(nextDay);
}
