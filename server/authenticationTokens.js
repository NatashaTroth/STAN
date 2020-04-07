import jwt from "jsonwebtoken";
import { User } from "./models/index";
import { ApolloError } from "apollo-server";
// import { createRefreshToken, createAccessToken } from "./auth";

export async function handleRefreshToken(req, res) {
  //read refresh cookie - validate that it's correct
  try {
    const payload = verifyRefreshToken(req);
    const user = await getUser(payload);
    sendRefreshToken(res, createRefreshToken(user));
    return res.send({ ok: true, accessToken: createAccessToken(user) });
  } catch (err) {
    console.log("Error in handleRefreshToken()");
    console.error(err.message);
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
  if (!user)
    throw new ApolloError("User object is empty, cannot create access token.");
  return jwt.sign(
    {
      userId: user.id,
      // googleLogin: user.googleLogin,
      tokenVersion: user.tokenVersion
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "15m"
    }
  );
};

/**
 * Creates and returns json token, containing the user id and tokenversion. Used as a refreshtoken for authentication.
 * @param {object} user
 */
export const createRefreshToken = user => {
  if (!user)
    throw new ApolloError("User object is empty, cannot create refresh token");
  return jwt.sign(
    { userId: user.id, tokenVersion: user.tokenVersion },
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

async function getUser(payload) {
  const user = await User.findOne({ _id: payload.userId });
  if (!user) throw new Error("No refresh token in cookie");
  if (user.tokenVersion !== payload.tokenVersion)
    throw new Error("No refresh token in cookie");
  return user;
}
