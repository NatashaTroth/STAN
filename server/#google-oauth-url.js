//source: https://medium.com/authpack/easy-google-auth-with-node-js-99ac40b97f4c
import * as queryString from "query-string";
import fetch from "node-fetch";
import axios from "axios";

//TODO MOVE TO CLIENT?
const stringifiedParams = queryString.stringify({
  client_id: process.env.GOOGLE_CLIENT_ID,
  // clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  redirect_uri: "http://localhost:3000",
  scope: [
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/userinfo.profile"
  ].join(" "), // space seperated string
  response_type: "code",
  access_type: "offline",
  prompt: "consent"
});

const googleLoginUrl = `https://accounts.google.com/o/oauth2/v2/auth?${stringifiedParams}`;

export function getGoogleLoginUrl() {
  return googleLoginUrl;
}

export async function getGoogleAccessTokenFromCode(code) {
  // fetch("http://localhost:5000/refresh_token", {
  //   method: "POST",
  //   credentials: "include",
  // })
  // const { data } = await fetch(`https://oauth2.googleapis.com/token`, {
  //   method: "POST",
  //   // credentials: "include",
  //   body: {
  //     client_id: process.env.GOOGLE_CLIENT_ID,
  //     client_secret: process.env.GOOGLE_CLIENT_SECRET,
  //     redirect_uri: "http://localhost:3000",
  //     grant_type: "authorization_code",
  //     code
  //   }
  // });

  // const { data } = await axios({
  //   url: `https://oauth2.googleapis.com/token`,
  //   method: "post",

  //   data: {
  //     client_id: process.env.GOOGLE_CLIENT_ID,
  //     client_secret: process.env.GOOGLE_CLIENT_SECRET,
  //     redirect_uri: "http://localhost:3000",
  //     grant_type: "authorization_code",
  //     code
  //   }
  // });
  console.log(data); // { access_token, expires_in, token_type, refresh_token }
  console.log("google data:");
  console.log(data); // { access_token, expires_in, token_type, refresh_token }
  return data.access_token;
}
