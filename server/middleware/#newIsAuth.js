const jwt = require("jsonwebtoken");
//TODO: refactor
module.exports = (req, res, next) => {
  //check if access token is in the header and if so, validate it
  //bearer slkjdfioejf
  const authorization = req.get("Authorization");
  // const authorization = req.headers["authorization"];

  if (!authorization) {
    throw new Error("not authenticated");
  }

  try {
    const token = authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if (!decodedToken) throw new Error("not authenticated");

    req.payload = decodedToken;
    req.userId = decodedToken.userId;
  } catch (err) {
    console.log(err);
    throw new Error("not authenticated");
  }
  req.isAuth = true;
  return next();

  // if (!authHeader) {
  //   req.isAuth = false;
  //   return next(); //executes next function (if there is one)
  // }
  // const token = authHeader.split(" ")[1]; //get token (removes Authorization: )
  // if (!token) {
  //   req.isAuth = false;
  //   return next();
  // }
  // let decodedToken;
  // try {
  //   decodedToken = jwt.verify(token, "secretSaveToEnv");
  // } catch (err) {
  //   req.isAuth = false;
  //   return next();
  // }

  // if (!decodedToken) {
  //   req.isAuth = false;
  //   return next();
  // }

  // //Token is valid
  // req.isAuth = true;
  // req.userId = decodedToken.userId;
  // next();
};
