function verifyEmail(string) {
  return string.match(
    /^([\w_\-\.\"\+\!\#\$\%\&\'\*\/\=\?\^\`\{\|\}\~ ]{1,64})@([\w_\-\.]+)\.([a-z]+)$/
  );
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

function verifyDate(string) {
  // return string.match(/^.{1,20}$/);
}

function verifyPageAmount(string) {
  return string.match(/^\d{1,10000}$/);
}

function verifyPageTime(string) {
  return string.match(/^\d{1,600}$/);
}

function verifyPageRepeat(string) {
  return string.match(/^\d{1,1000}$/);
}

function verifyPageNotes(string) {
  return string.match(/^.{1,100000000}$/);
}

module.exports = {
  verifyEmail,
  verifyUsername,
  verifyPassword,
  verifySubject,
  verifyDate,
  verifyPageAmount,
  verifyPageTime,
  verifyPageRepeat,
  verifyPageNotes
};
