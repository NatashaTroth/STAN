import { AuthenticationError } from "apollo-server";

export function handleResolverError(err) {
  if (
    err.extensions &&
    err.extensions.code &&
    err.extensions.code !== "UNAUTHENTICATED"
  )
    throw new AuthenticationError(err.message);
  throw err;
}
