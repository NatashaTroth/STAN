const { verifyEmail } = require("../../helpers/regex");

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

  expect(verifyEmail("@fh-salzburg.ac.at")).toBeFalsy();
  expect(verifyEmail("Abc.example.com")).toBeFalsy();
  expect(verifyEmail("A@b@c@example.com")).toBeFalsy();
  expect(verifyEmail('a"b(c)d,e:f;g<h>i[jk]l@example.com')).toBeFalsy();
  // expect(verifyEmail('just"not"right@example.com')).toBeFalsy();
  // expect(verifyEmail('this is"notallowed@example.com')).toBeFalsy();
  expect(verifyEmail('this still"not\\allowed@example.com')).toBeFalsy();
  expect(
    verifyEmail(
      "1234567890123456789012345678901234567890123456789012345678901234+x@example.com"
    )
  ).toBeFalsy();
  // expect(
  //   verifyEmail(
  //     "123456789012345678901234567890123+x@12345678901234567890123456789012345678901234567890123456789012341234567890123456789012345678901234567890123456789012345678901234123456789012345678901234567890123456789012345678901234567890123412345678901234567890123456789012345678901234567893454589347584901234567.com"
  //   )
  // ).toBeFalsy();
});

//verify password
//verify dates
//verify no script xss
