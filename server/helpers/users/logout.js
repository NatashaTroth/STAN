import {
  sendRefreshToken,
  invalidateAccessTokens,
  invalidateRefreshTokens
} from "../authentication/authenticationTokens";
import { ApolloError } from "apollo-server";

export async function logUserOut(res, userId) {
  sendRefreshToken(res, "");

  //invalidate current refresh tokens for user
  const respRefreshToken = await invalidateRefreshTokens(userId);

  if (!respRefreshToken) throw new ApolloError("Unable to revoke refresh token.");
  const respAccessToken = await invalidateAccessTokens(userId);

  if (!respAccessToken) throw new ApolloError("Unable to revoke access token.");
}
