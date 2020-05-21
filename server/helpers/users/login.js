import {
  createAccessToken,
  createRefreshToken
} from "../authentication/authenticationTokens";
import { sendRefreshToken } from "../authentication/authenticationTokens";

export function logUserIn({ user, res }) {
  let userAccessToken = createAccessToken(user);
  sendRefreshToken(res, createRefreshToken(user));
  return userAccessToken;
}
