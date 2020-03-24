const {
  verifyEmail,
  verifyUsername,
  verifyPassword,
  verifySubject,
  verifyDate,
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

  expect(verifyEmail("@fh-salzburg.ac.at")).toBeFalsy();
  expect(verifyEmail("Abc.example.com")).toBeFalsy();
  expect(verifyEmail("A@b@c@example.com")).toBeFalsy();
  expect(verifyEmail('a"b(c)d,e:f;g<h>i[jk]l@example.com')).toBeFalsy();
  // expect(verifyEmail('just"not"right@example.com')).toBeFalsy();
  // expect(verifyEmail('this is"notallowed@example.com')).toBeFalsy();
  expect(verifyEmail('this still"not\\allowed@example.com')).toBeFalsy();
  expect(verifyEmail("")).toBeFalsy();
  expect(verifyEmail("b".repeat(65) + "@example.com")).toBeFalsy();
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

// test("verifies string is formatted as a date", () => {
//   expect(verifySubject("11-12-2020")).toBeTruthy();
//   expect(verifySubject("12345678901234567890")).toBeTruthy();
//   expect(verifySubject("di4sz$§d")).toBeTruthy();
//   expect(verifySubject("!\"§$%&/()=?*+'#-_.:,;")).toBeTruthy();
//   expect(verifySubject("k")).toBeTruthy();

//   expect(verifySubject("123456789012345678905")).toBeFalsy();
//   expect(verifySubject("123454")).toBeFalsy();
//   expect(verifySubject("di4sz$§")).toBeFalsy();
//   expect(verifySubject("")).toBeFalsy();
// });

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
