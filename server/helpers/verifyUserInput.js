export function verifyRegexEmail(string) {
  //the upper limit is normally 254 - but older addresses might still be 320
  if (!string.match(/^.{1,320}$/)) return false;
  const emailRegex = /^([\w_\-."+!#$%&'*/=?^`{|}~ ]{1,64})@([\w_\-.]+)\.([a-z]+)$/;
  if (!string.match(emailRegex)) return false;
  let domain = string.split("@")[1];
  if (!domain.match(/^.{1,255}$/)) return false;
  return true;
}

export function verifyRegexUsername(string) {
  return string.match(/^.{1,30}$/);
}

export function verifyRegexPassword(string) {
  return string.match(/^.{8,30}$/);
}

export function verifyRegexMascot(string) {
  return string.match(/[012]/);
}

export function verifyRegexSubject(string) {
  return string.match(/^.{1,20}$/);
}

export function verifyRegexExamDate(string) {
  if (!validateRegexDate(string)) return false;
  return true;
}
export function verifyRegexStudyStartDate(string) {
  if (string.match(/^.{0}$/)) return true;
  if (!validateRegexDate(string)) return false;
  return true;
}

export function verifyRegexPageAmount(string) {
  return string.match(/^\d{1,10000}$/);
}

export function verifyRegexPageTime(string) {
  return string.match(/^\d{1,600}$/);
}

export function verifyRegexPageRepeat(string) {
  return string.match(/^\d{0,1000}$/);
}

export function verifyRegexCurrentPage(string) {
  return string.match(/^\d{0,10000}$/);
}

export function verifyRegexPageNotes(string) {
  //Regex returns: RangeError: Maximum call stack size exceeded at String.match (<anonymous>)
  // return string.match(/^.{0,100000000}$/);
  if (string.length > 100000000) return false;
  return true;
}

function validateRegexDate(string) {
  let regexDateOne = /^(0?[1-9]|[12][0-9]|3[01])[-|/|.](0?[1-9]|1[012])[-|/|.]\d{4}$/;
  let regexDateTwo = /^\d{4}[-|/|.](0?[1-9]|1[012])[-|/|.](0?[1-9]|[12][0-9]|3[01])$/;
  let regexDateThree = /^(0?[1-9]|1[012])[-|/|.](0?[1-9]|[12][0-9]|3[01])[-|/|.]\d{4}$/;
  if (
    !string.match(regexDateOne) &&
    !string.match(regexDateTwo) &&
    !string.match(regexDateThree)
  )
    return false;
  return true;
}
