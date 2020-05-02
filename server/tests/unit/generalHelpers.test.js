import {
  roundToTwoDecimals,
  escapeObjectForHtml,
  escapeStringForHtml
} from "../../helpers/generalHelpers";

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

test("that the float is rounded to two decimals correctly", () => {
  expect(escapeStringForHtml("<script>")).toBe("&lt;script&gt;");
  expect(escapeStringForHtml("<script>alert('Oh no hacker')</script>")).toBe(
    "&lt;script&gt;alert(&#x27;Oh no hacker&#x27;)&lt;&#x2F;script&gt;"
  );
  expect(escapeStringForHtml("I'm not evil")).toBe("I&#x27;m not evil");
});

test("that the float is rounded to two decimals correctly", () => {
  const currentUser = {
    id: "5e97499744dbe5306bfbe26d",
    username: "<b>I'm a very bold person</b>",
    email: "<script>alert('I like to stay alerted')</script>",
    mascot: 0,
    googleLogin: false
  };
  expect(escapeObjectForHtml(currentUser)).toMatchObject({
    id: "5e97499744dbe5306bfbe26d",
    username: "&lt;b&gt;I&#x27;m a very bold person&lt;&#x2F;b&gt;",
    email:
      "&lt;script&gt;alert(&#x27;I like to stay alerted&#x27;)&lt;&#x2F;script&gt;",
    mascot: 0,
    googleLogin: false
  });
});
