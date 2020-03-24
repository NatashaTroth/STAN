function verifyEmail(string) {
  //the upper limit is normally 254 - but older addresses might still be 320
  if (!string.match(/^.{1,320}$/)) return false;
  const emailRegex = /^([\w_\-\.\"\+\!\#\$\%\&\'\*\/\=\?\^\`\{\|\}\~ ]{1,64})@([\w_\-\.]+)\.([a-z]+)$/;
  if (!string.match(emailRegex)) return false;
  let domain = string.split("@")[1];
  if (!domain.match(/^.{1,255}$/)) return false;
  return true;
}

function verifyUsername(string) {
  return string.match(/^.{1,30}$/);
}

function verifyPassword(string) {
  return string.match(/^.{8,30}$/);
}

function verifySubject(string) {
  return string.match(/^.{1,20}$/);
}

function verifyExamDate(string) {
  // return string.match(/^.(\d{1-4})[-|/|.](\d{1-2})[-|/|.](\d{1-4})$/);
}
function verifyStudyStartDate(string) {
  //if(match empty, or match date pattern)
  // return string.match(/^.(\d{1-4})[-|/|.](\d{1-2})[-|/|.](\d{1-4})$/);
}

function verifyPageAmount(string) {
  return string.match(/^\d{1,10000}$/);
}

function verifyPageTime(string) {
  return string.match(/^\d{0,600}$/);
}

function verifyPageRepeat(string) {
  return string.match(/^\d{0,1000}$/);
}

function verifyPageNotes(string) {
  return string.match(/^.{0,100000000}$/);
}

module.exports = {
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
};
