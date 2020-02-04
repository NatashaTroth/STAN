const jwt = require("jsonwebtoken");
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
    decodedToken = jwt.verify(token, "secretSaveToEnv");
  } catch (err) {
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
