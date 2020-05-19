import {
  roundToTwoDecimals,
  escapeObjectForHtml,
  escapeStringForHtml,
  removeWhitespace
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

test("that removeWhitespace works properly", () => {
  expect(removeWhitespace(" h e l l o ")).toBe("hello");
  expect(removeWhitespace(" https ://google.at ")).toBe("https://google.at");
});

test("that the float is rounded to two decimals correctly", () => {
  expect(escapeStringForHtml("<script>")).toBe("&lt;script&gt;");
  expect(escapeStringForHtml("<script>alert('Oh no hacker')</script>")).toBe(
    "&lt;script&gt;alert(&#x27;Oh no hacker&#x27;)&lt;&#x2F;script&gt;"
  );
  expect(escapeStringForHtml("I'm not evil")).toBe("I&#x27;m not evil");
});

test("that the float is rounded to two decimals correctly", () => {
  const user = {
    id: "5e97499744dbe5306bfbe26d",
    username: "<b>I'm a very bold person</b>",
    email: "<script>alert('I like to stay alerted')</script>",
    mascot: 0,
    googleLogin: false
  };
  expect(escapeObjectForHtml(user)).toMatchObject({
    id: "5e97499744dbe5306bfbe26d",
    username: "&lt;b&gt;I&#x27;m a very bold person&lt;&#x2F;b&gt;",
    email:
      "&lt;script&gt;alert(&#x27;I like to stay alerted&#x27;)&lt;&#x2F;script&gt;",
    mascot: 0,
    googleLogin: false
  });

  const exam = {
    id: "5ea6a859bfabd8e94b10d1e4",
    subject: "<b>I'm a very bold person</b>",
    examDate: "2020-05-19T00:00:00.000Z",
    startDate: "2020-05-01T00:00:00.000Z",
    startPage: 4,
    currentPage: 46,
    numberPages: 45,
    timePerPage: 3,
    timesRepeat: 1,
    completed: false,
    notes:
      "<img onerror='window.document.body.innerHTML = \"<h1>You have been hacked !</h1>\";' src=''>",
    studyMaterialLinks: ["<script>alert('I like & to stay alerted')</script>"]
  };

  expect(escapeObjectForHtml(exam)).toMatchObject({
    id: "5ea6a859bfabd8e94b10d1e4",
    subject: "&lt;b&gt;I&#x27;m a very bold person&lt;&#x2F;b&gt;",
    examDate: "2020-05-19T00:00:00.000Z",
    startDate: "2020-05-01T00:00:00.000Z",
    startPage: 4,
    currentPage: 46,
    numberPages: 45,
    timePerPage: 3,
    timesRepeat: 1,
    completed: false,
    notes:
      "&lt;img onerror=&#x27;window.document.body.innerHTML = &quot;&lt;h1&gt;You have been hacked !&lt;&#x2F;h1&gt;&quot;;&#x27; src=&#x27;&#x27;&gt;",
    studyMaterialLinks: [
      "&lt;script&gt;alert(&#x27;I like &amp; to stay alerted&#x27;)&lt;&#x2F;script&gt;"
    ]
  });
});
