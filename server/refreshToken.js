//TODO: Change 'refresh_token' name

import jwt from "jsonwebtoken";
import { User } from "./models/index";
import { createRefreshToken, createAccessToken } from "./auth";

export async function handleRefreshToken(req, res) {
  //read refresh cookie - validate that it's correct
  //TODO:late change name of refresh_token
  console.log(" hhhheeEREREE I MAMMMMMMMM");
  const token = req.cookies.refresh_token;
  if (!token) {
    return res.send({ ok: false, accessToken: "" });
  }
  let payload = null;

  try {
    payload = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
  } catch (err) {
    console.log(err);
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

export const sendRefreshToken = (res, token) => {
  // console.log("sending refresh token");
  //TODO: allow to expire cookie - so when logout - it deletes the cookie
  //TODO: rename refresh_token
  res.cookie("refresh_token", token, {
    httpOnly: true,
    path: "/refresh_token" //to only send request token when at refresh_token path
  });
};
