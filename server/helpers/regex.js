export function verifyEmail(string) {
  return string.match(
    /^([\w_\-\.\"\+\!\#\$\%\&\'\*\/\=\?\^\`\{\|\}\~ ]{1,64})@([\w_\-\.]+)\.([a-z]+)$/
  );
}

export function verifyUsername(string) {
  return string.match(/^.{1,30}$/);
}

export function verifyPassword(string) {
  return string.match(/^.{8,30}$/);
}

export function verifySubject(string) {
  return string.match(/^.{1,20}$/);
}

export function verifyExamDate(string) {
  // return string.match(/^.{1,20}$/);
}

export function verifyStudyStartDate(string) {
  // return string.match(/^.{1,20}$/);
}

export function verifyPageAmount(string) {
  return string.match(/^.{1,10000}$/);
}

export function verifyPageTime(string) {
  return string.match(/^.{1,600}$/);
}

export function verifyPageRepeat(string) {
  return string.match(/^.{1,1000}$/);
}

export function verifyPageNotes(string) {
  return string.match(/^.{1,100000000}$/);
}
