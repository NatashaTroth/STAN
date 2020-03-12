//TODO: REFACTOR: https://www.youtube.com/watch?v=25GS0MLT8JU

import jwt from "jsonwebtoken";
import { User } from "../models";
import { AuthenticationError } from "apollo-server";

//TODO: refactor
module.exports = async (req, res, next) => {
  // console.log("in is auth");
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    //req.isAuth -> new property in req
    req.isAuth = false;
    // console.log("not authenticated");

    return next(); //executes next function (if there is one)
  }
  const token = authHeader.split(" ")[1]; //get token (removes Authorization: )
  if (!token) {
    req.isAuth = false;
    // console.log("not authenticated");

    return next();
  }

  let decodedToken;

  try {
    decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findOne({ _id: decodedToken.userId });
    if (user.tokenVersion !== decodedToken.tokenVersion)
      throw new AuthenticationError("Wrong token version");
  } catch (err) {
    console.log(err);
    req.isAuth = false;
    // console.log("not authenticated");

    return next();
  }

  if (!decodedToken) {
    req.isAuth = false;
    // console.log("not authenticated");

    return next();
  }
  // console.log("i'm authenticated");
  //Token is valid
  req.isAuth = true;
  req.userId = decodedToken.userId;
  next();
};
