//TODO: REFACTOR: https://www.youtube.com/watch?v=25GS0MLT8JU

import jwt from "jsonwebtoken";
//TODO: refactor
module.exports = (req, res, next) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    req.isAuth = false;
    return next(); //executes next function (if there is one)
  }
  const token = authHeader.split(" ")[1]; //get token (removes Authorization: )
  if (!token) {
    req.isAuth = false;
    return next();
  }

  let decodedToken;

  try {
    decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  } catch (err) {
    console.log(err);
    req.isAuth = false;
    return next();
  }

  if (!decodedToken) {
    req.isAuth = false;
    return next();
  }

  //Token is valid
  req.isAuth = true;
  req.userId = decodedToken.userId;
  next();
};
