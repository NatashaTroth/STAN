//TODO: EXTRACT ALL DATABASE LOGIC TO APOLLO DATASOURCE: https://www.apollographql.com/docs/tutorial/data-source/
//TODO: RAFACTOR
import { User } from "../models";
import {
  UserInputError,
  AuthenticationError,
  ApolloError
} from "apollo-server";
import { createAccessToken, createRefreshToken } from "../authenticationTokens";
import { sendRefreshToken } from "../authenticationTokens";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

//TODO: Authenticate Queries
const userResolvers = {
  Query: {
    users: (root, arg, { req, res }, info) => {
      // if (!req.isAuth) throw new Error("Unauthorised");
      return User.find({});
    },
    user: (root, arg, context, info) => {
      return fetchOneData();
    },
    currentUser: async (parent, ars, context) => {
      //TODO: return unauthorise important? returning null to avoid error when asking for current user in frontend and not logged in
      // if (!context.req.isAuth) throw new Error(" Unauthorised");
      if (!context.req.isAuth) return null;
      // fetch header
      const authorization = context.req.get("Authorization");
      if (!authorization) return null;
      try {
        //TODO: SAVE ALL PAYLOAD
        //TODO: do i need to do all this?:s
        const token = authorization.split(" ")[1];
        const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findOne({ _id: payload.userId });
        if (user.tokenVersion !== payload.tokenVersion)
          throw new AuthenticationError("Wrong token version");
        return user;
      } catch (err) {
        console.error(err.message);
        return null;
      }
    }
  },
  Mutation: {
    logout: (root, args, { req, res }, info) => {
      try {
        if (!req.isAuth) throw new Error("Unauthorised");
        sendRefreshToken(res, "");
        //invalidate current refresh tokens for user
        const resp = revokeRefreshTokensForUser(req.userId);
        if (!resp) throw new ApolloError("Unable to revoke refresh token");
      } catch (err) {
        throw new ApolloError(err.message);
      }
      return true;
    },
    login: async (parent, { email, password }, context) => {
      if (context.req.isAuth) throw new Error("Already logged in");
      try {
        const user = await authenticateUser({ email, password });
        const accessToken = logUserIn({ user, context });
        return { user: user, accessToken: accessToken, tokenExpiration: 15 };
      } catch (err) {
        if (
          err.extensions &&
          err.extensions.code &&
          err.extensions.code !== "UNAUTHENTICATED"
        )
          throw new AuthenticationError(err.message);
        throw err;
      }
    },
    signup: async (parent, { username, email, password, mascot }, context) => {
      if (context.req.isAuth) throw new Error("Already logged in");

      try {
        // console.log("googlog: " + googleLogin);

        const user = await signUserUp({
          username,
          email,
          password,
          mascot
        });
        const accessToken = logUserIn({ user, context });
        return { user, accessToken, tokenExpiration: 15 };
      } catch (err) {
        if (
          err.extensions &&
          err.extensions.code &&
          err.extensions.code !== "UNAUTHENTICATED"
        )
          throw new AuthenticationError(err.message);
        throw err;
      }
    },
    googleLogin: async (parent, { idToken }, context) => {
      //https://developers.google.com/identity/sign-in/web/backend-auth
      try {
        const payload = await verifyGoogleIdToken(idToken);
        if (!payload)
          throw new AuthenticationError("Google id token was not verified.");
        let user = await User.findOne({ googleId: payload.sub });
        // resp = authenticateGoogleUser(user); //if already got account don't think i need to authenticate user cause google already did that

        if (!user) user = await signUpGoogleUser(payload);

        const accessToken = logUserIn({ user, context });
        return { user, accessToken, tokenExpiration: 15 };
      } catch (err) {
        if (
          err.extensions &&
          err.extensions.code &&
          err.extensions.code !== "UNAUTHENTICATED"
        )
          throw new AuthenticationError(err.message);
        throw err;
      }
    }
  }
};

async function authenticateUser({ email, password }) {
  const user = await User.findOne({ email: email });
  if (!user)
    throw new AuthenticationError("User with this email does not exist");

  //in case user tries to login with google login data in normal login - cause no password!
  if (user.googleLogin)
    throw new AuthenticationError("User has to login with google");

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new AuthenticationError("Password is incorrect");
  return user;
}

async function signUserUp({
  username,
  email,
  password,
  mascot,
  googleId,
  googleLogin
}) {
  const userWithEmail = await User.findOne({ email: email });
  if (userWithEmail) throw new UserInputError("User with email already exists");
  let hashedPassword;
  if (googleLogin) hashedPassword = null;
  else hashedPassword = await bcrypt.hash(password, 10);
  const resp = await User.create({
    username,
    email,
    password: hashedPassword,
    mascot: mascot || 0,
    googleId: googleId || "",
    googleLogin: googleLogin || false
  });

  if (!resp) throw new AuthenticationError("User could not be created");
  return resp;
}

function logUserIn({ user, context }) {
  let userAccessToken = createAccessToken(user);

  sendRefreshToken(context.res, createRefreshToken(user));

  return userAccessToken;
}

function signUpGoogleUser(payload) {
  return signUserUp({
    username: payload.name,
    email: payload.email,
    password: null,
    googleId: payload.sub,
    googleLogin: true
    // mascot: 1 //TODO GET MASCOT USER CHOSE
  });
}

//TODO: don't make this available to users - the revoke code should be used in a method, say if password forgotton / change password or user account hacked - closes all open sessions
async function revokeRefreshTokensForUser(userId) {
  try {
    const user = await User.findOne({ _id: userId });
    if (!user) throw new AuthenticationError("This user does not exist");
    await User.updateOne({ _id: userId }, { $inc: { tokenVersion: 1 } });
    return true;
  } catch (err) {
    if (
      err.extensions &&
      err.extensions.code &&
      err.extensions.code !== "UNAUTHENTICATED"
    )
      throw new ApolloError(err.message);
    throw err;
  }
}

//source: https://developers.google.com/identity/sign-in/web/backend-auth
async function verifyGoogleIdToken(token) {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_CLIENT_ID
  });
  const payload = ticket.getPayload();
  // const userid = payload["sub"];
  return payload;
  // If request specified a G Suite domain:
  //const domain = payload['hd'];
}

module.exports = {
  userResolvers
};
