//source: https://medium.com/authpack/easy-google-auth-with-node-js-99ac40b97f4c
import * as queryString from "query-string";

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
