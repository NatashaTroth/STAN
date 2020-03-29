// import { NamedModulesPlugin } from "webpack";

const jwt = require("jsonwebtoken");
const { User } = require("./models/index");
const { ApolloError } = require("apollo-server");
// import jwt from "jsonwebtoken";
// import { User } from "./models/index";
// import { ApolloError } from "apollo-server";
// import { createRefreshToken, createAccessToken } from "./auth";

async function handleRefreshToken(req, res) {
  //read refresh cookie - validate that it's correct
  const token = req.cookies.refresh_token;
  if (!token) {
    return res.send({ ok: false, accessToken: "" });
  }
  let payload = null;

  try {
    payload = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
  } catch (err) {
    // console.log(err);
    return res.send({ ok: false, accessToken: "" });
  }
  //token is valid and we can send back an access token
  const user = await User.findOne({ _id: payload.userId });
  if (!user) {
    return res.send({ ok: false, accessToken: "" });
  }

  if (user.tokenVersion !== payload.tokenVersion) {
    return res.send({ ok: false, accessToken: "" });
  }
  //also refresh the refresh token
  sendRefreshToken(res, createRefreshToken(user));
  return res.send({ ok: true, accessToken: createAccessToken(user) });
}

const sendRefreshToken = (res, token) => {
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
const createAccessToken = user => {
  if (!user)
    throw new ApolloError("User object is empty, cannot create access token");
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
const createRefreshToken = user => {
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

module.exports = {
  handleRefreshToken,
  sendRefreshToken,
  createAccessToken,
  createRefreshToken
};
