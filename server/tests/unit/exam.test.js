const { datesTimingIsValid } = require("../../helpers/dates");

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
