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
