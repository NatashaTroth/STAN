// //TODO: TEST ALL ASCII CHARS
const {
  verifyEmail,
  verifyUsername,
  verifyPassword,
  verifySubject,
  verifyExamDate,
  verifyStudyStartDate,
  verifyPageAmount,
  verifyPageTime,
  verifyPageRepeat,
  verifyPageNotes
} = require("../../helpers/regex");

test("verifies string is formatted as an email", () => {
  expect(verifyEmail("ntroth.mmt-b2017@fh-salzburg.ac.at")).toBeTruthy();
  expect(verifyEmail("n@f.at")).toBeTruthy();
  expect(verifyEmail("123.-3@d.at")).toBeTruthy();
  expect(verifyEmail("very.common@example.com")).toBeTruthy();
  expect(
    verifyEmail("disposable.style.email.with+symbol@example.com")
  ).toBeTruthy();
  expect(verifyEmail("other.email-with-hyphen@example.com")).toBeTruthy();
  expect(verifyEmail("fully-qualified-domain@example.com")).toBeTruthy();
  expect(verifyEmail("user.name+tag+sorting@example.com")).toBeTruthy();
  expect(verifyEmail("example-indeed@strange-example.com")).toBeTruthy();
  expect(verifyEmail("example@s.example")).toBeTruthy();
  expect(verifyEmail('" "@example.org')).toBeTruthy();
  expect(verifyEmail('"john..doe"@example.org')).toBeTruthy();
  expect(verifyEmail("mailhost!username@example.org")).toBeTruthy();
  expect(verifyEmail("user%example.com@example.org")).toBeTruthy();
  expect(verifyEmail("a".repeat(64) + "@example.com")).toBeTruthy();
  expect(
    verifyEmail("a".repeat(64) + "@" + "a".repeat(251) + ".com")
  ).toBeTruthy();

  expect(verifyEmail("@fh-salzburg.ac.at")).toBeFalsy();
  expect(verifyEmail("Abc.example.com")).toBeFalsy();
  expect(verifyEmail("A@b@c@example.com")).toBeFalsy();
  expect(verifyEmail('a"b(c)d,e:f;g<h>i[jk]l@example.com')).toBeFalsy();
  // expect(verifyEmail('just"not"right@example.com')).toBeFalsy();
  // expect(verifyEmail('this is"notallowed@example.com')).toBeFalsy();
  expect(verifyEmail('this still"not\\allowed@example.com')).toBeFalsy();
  expect(verifyEmail("")).toBeFalsy();
  expect(verifyEmail("b".repeat(65) + "@example.com")).toBeFalsy();
  expect(
    verifyEmail("a".repeat(64) + "@" + "a".repeat(252) + ".com")
  ).toBeFalsy();
});

test("verifies string is formatted as a username", () => {
  expect(verifyUsername("dsfj3$%fdsdf")).toBeTruthy();
  expect(verifyUsername("c".repeat(30))).toBeTruthy();
  expect(verifyUsername("di4sz$§d")).toBeTruthy();
  expect(verifyUsername('kls7$5469!"§$%&/()=?$§d')).toBeTruthy();
  expect(verifyUsername("%")).toBeTruthy();
  expect(verifyUsername("\u0035")).toBeTruthy();

  expect(verifyUsername("d".repeat(31))).toBeFalsy();
  expect(verifyUsername("")).toBeFalsy();
});

test("verifies string is formatted as a password", () => {
  expect(verifyPassword("dsfj3$%fdsdf")).toBeTruthy();
  expect(verifyPassword("e".repeat(30))).toBeTruthy();
  expect(verifyPassword("di4sz$§d")).toBeTruthy();
  expect(verifyPassword('kls7$5469!"§$%&/()=?$§d')).toBeTruthy();

  expect(verifyPassword("f".repeat(31))).toBeFalsy();
  expect(verifyPassword("g".repeat(7))).toBeFalsy();
  expect(verifyPassword("di4sz$§")).toBeFalsy();
  expect(verifyPassword("")).toBeFalsy();
});

test("verifies string is formatted as a subject", () => {
  expect(verifySubject("Maths")).toBeTruthy();
  expect(verifySubject("h".repeat(20))).toBeTruthy();
  expect(verifySubject("di4sz$§d")).toBeTruthy();
  expect(verifySubject("!\"§$%*+'#-_.:,;")).toBeTruthy();
  expect(verifySubject("&/()=?")).toBeTruthy();
  expect(verifySubject("k")).toBeTruthy();

  expect(verifySubject("i".repeat(21))).toBeFalsy();
  expect(verifySubject("")).toBeFalsy();
});

test("verifies string is formatted as an exam date", () => {
  dateTests(verifyExamDate);
  expect(verifyExamDate("")).toBeFalsy();
});

test("verifies string is formatted as an start date", () => {
  dateTests(verifyStudyStartDate);
  expect(verifyStudyStartDate("")).toBeTruthy();
});

test("verifies string is formatted as a page amount", () => {
  expect(verifyPageAmount("11")).toBeTruthy();
  expect(verifyPageAmount("1".repeat(10000))).toBeTruthy();
  expect(verifyPageAmount("1234567890")).toBeTruthy();
  expect(verifyPageAmount("\u0035")).toBeTruthy();

  expect(verifyPageAmount("1".repeat(10001))).toBeFalsy();
  expect(verifyPageAmount("!\"§$%&/()=?*+'#-_.:,;")).toBeFalsy();
  expect(verifyPageAmount("di4sz45$§")).toBeFalsy();
  expect(verifyPageAmount("")).toBeFalsy();
});

test("verifies string is formatted as a page time", () => {
  expect(verifyPageTime("11")).toBeTruthy();
  expect(verifyPageTime("1".repeat(600))).toBeTruthy();
  expect(verifyPageTime("1234567890")).toBeTruthy();
  expect(verifyPageTime("\u0035")).toBeTruthy();
  expect(verifyPageTime("")).toBeTruthy();

  expect(verifyPageTime("1".repeat(601))).toBeFalsy();
  expect(verifyPageTime("!\"§$%&/()=?*+'#-_.:,;")).toBeFalsy();
  expect(verifyPageTime("di4sz45$§")).toBeFalsy();
});

test("verifies string is formatted as a page repeat", () => {
  expect(verifyPageRepeat("11")).toBeTruthy();
  expect(verifyPageRepeat("1".repeat(1000))).toBeTruthy();
  expect(verifyPageRepeat("1234567890")).toBeTruthy();
  expect(verifyPageRepeat("\u0035")).toBeTruthy();
  expect(verifyPageRepeat("")).toBeTruthy();

  expect(verifyPageRepeat("1".repeat(1001))).toBeFalsy();
  expect(verifyPageRepeat("!\"§$%&/()=?*+'#-_.:,;")).toBeFalsy();
  expect(verifyPageRepeat("di4sz45$§")).toBeFalsy();
});

test("verifies string is formatted as notes", () => {
  expect(verifyPageNotes("dsfj3$%fdsdf")).toBeTruthy();
  expect(verifyPageNotes("c".repeat(100000000))).toBeTruthy();
  expect(verifyPageNotes("di4sz$§d")).toBeTruthy();
  expect(verifyPageNotes('kls7$5469!"§$%%&/()=?$§d')).toBeTruthy();
  expect(verifyPageNotes("\u0035")).toBeTruthy();
  expect(verifyPageNotes("")).toBeTruthy();

  expect(verifyPageNotes("d".repeat(100000001))).toBeFalsy();
});

function dateTests(dateFunction) {
  expect(dateFunction("11-12-2020")).toBeTruthy();
  expect(dateFunction("2020-12-11")).toBeTruthy();
  expect(dateFunction("05.06.2020")).toBeTruthy();
  expect(dateFunction("05.06.2020")).toBeTruthy();
  expect(dateFunction("2023.12.2")).toBeTruthy();
  expect(dateFunction("01/12/2020")).toBeTruthy();
  expect(dateFunction("2016/05/7")).toBeTruthy();

  expect(dateFunction("0-0-0")).toBeFalsy();
  expect(dateFunction("00-00-0000")).toBeFalsy();
  expect(dateFunction("05.06.20")).toBeFalsy();
  expect(dateFunction("32.12.2020")).toBeFalsy();
  expect(dateFunction("30/13/2020")).toBeFalsy();
  expect(dateFunction("dd-0-0")).toBeFalsy();
  expect(dateFunction("32.mm.2020")).toBeFalsy();
  expect(dateFunction("30/13/yyyy")).toBeFalsy();
  expect(dateFunction("0-0-0")).toBeFalsy();
  expect(dateFunction("32.12.2020")).toBeFalsy();
  expect(dateFunction("30/13/2020")).toBeFalsy();
  expect(dateFunction("123454")).toBeFalsy();
  expect(dateFunction("di4sz$§")).toBeFalsy();
}
