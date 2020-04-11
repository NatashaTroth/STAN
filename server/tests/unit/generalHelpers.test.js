import { roundToTwoDecimals } from "../../helpers/generalHelpers";

test("that the float is rounded to two decimals correctly", () => {
  expect(roundToTwoDecimals(50)).toBe(50);
  expect(roundToTwoDecimals(50.1)).toBe(50.1);
  expect(roundToTwoDecimals(50.11)).toBe(50.11);
  expect(roundToTwoDecimals(50.115)).toBe(50.12);
  expect(roundToTwoDecimals(50.499)).toBe(50.5);
  expect(roundToTwoDecimals(3452.34534348907543)).toBe(3452.35);
  expect(roundToTwoDecimals(345.657)).toBe(345.66);
  expect(roundToTwoDecimals(0.459437584)).toBe(0.46);
  expect(roundToTwoDecimals(20384.999)).toBe(20385);
});
