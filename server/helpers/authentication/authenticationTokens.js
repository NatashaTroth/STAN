import jwt from "jsonwebtoken";
import { User } from "../../models/index";
import { ApolloError } from "apollo-server";
import { handleResolverError } from "../generalHelpers";
// import { createRefreshToken, createAccessToken } from "./auth";

export function createLoginTokens({ user, res }) {
  let userAccessToken = createAccessToken(user);
  sendRefreshToken(res, createRefreshToken(user));
  return userAccessToken;
}

export async function handleRefreshTokenRoute(req, res) {
  //read refresh cookie - validate that it's correct
  try {
    const payload = verifyRefreshToken(req);
    const user = await getUserFromToken(payload);
    sendRefreshToken(res, createRefreshToken(user));
    return res.send({ ok: true, accessToken: createAccessToken(user) });
  } catch (err) {
    console.error("Error in handleRefreshTokenRoute(): " + err.message);
    return res.send({ ok: false, accessToken: "" });
  }
}

export const sendRefreshToken = (res, token) => {
  if (res)
    res.cookie("refresh_token", token, {
      httpOnly: true,
      path: "/refresh_token" //to only send request token when at refresh_token path
    });
};

/**
 * Creates and returns a json token, containing the user id. Used as short term access token for authentication.
 * @param {object} user
 */
export const createAccessToken = user => {
  if (!user) throw new ApolloError("User object is empty, cannot create access token.");
  return jwt.sign(
    {
      userId: user.id,
      // googleLogin: user.googleLogin,
      tokenVersion: user.accessTokenVersion
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "15m" //TODO CHANGE BACK TO 15m !!!!!!!!
    }
  );
};

/**
 * Creates and returns json token, containing the user id and tokenversion. Used as a refreshtoken for authentication.
 * @param {object} user
 */
export const createRefreshToken = user => {
  if (!user) throw new ApolloError("User object is empty, cannot create refresh token");
  return jwt.sign(
    { userId: user.id, tokenVersion: user.refreshTokenVersion },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "7d"
    }
  );
};

function verifyRefreshToken(req) {
  const token = req.cookies.refresh_token;
  if (!token) throw new Error("No refresh token in cookie");
  return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
}

async function getUserFromToken(payload) {
  const user = await User.findOne({ _id: payload.userId });
  if (!user) throw new Error("No refresh token in cookie");
  if (user.refreshTokenVersion !== payload.tokenVersion)
    throw new Error("No refresh token in cookie");
  return user;
}

export async function invalidationAuthenticationTokens(userId) {
  const respRefreshToken = await invalidateRefreshTokens(userId);
  if (!respRefreshToken) throw new ApolloError("Unable to revoke refresh token.");
  const respAccessToken = await invalidateAccessTokens(userId);
  if (!respAccessToken) throw new ApolloError("Unable to revoke access token.");
}
//TODO:  the revoke code should be used in a method, say if password forgotton / change password or user account hacked - closes all open sessions
async function invalidateRefreshTokens(userId) {
  try {
    const resp = await User.updateOne(
      { _id: userId },
      { $inc: { refreshTokenVersion: 1 }, updatedAt: new Date() }
    );
    if (resp.nModified === 0) throw new Error("Refresh token version was not increased.");

    return true;
  } catch (err) {
    handleResolverError(err);
  }
}

async function invalidateAccessTokens(userId) {
  try {
    const resp = await User.updateOne(
      { _id: userId },
      { $inc: { accessTokenVersion: 1 }, updatedAt: new Date() }
    );
    if (resp.nModified === 0) throw new Error("Access token version was not increased.");

    return true;
  } catch (err) {
    handleResolverError(err);
  }
}
