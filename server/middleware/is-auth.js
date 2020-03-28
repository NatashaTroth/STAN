import jwt from "jsonwebtoken";
import { User } from "../models";
import { AuthenticationError } from "apollo-server";

// module.exports = async (req, res, next) => {
export async function isAuth(req) {
  //req.isAuth -> new property in req
  // req.isAuth = false;

  const authHeader = req.get("Authorization");
  if (!authHeader) return false; //executes next function (if there is one)

  try {
    const token = authHeader.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if (!decodedToken) return false;

    const user = await User.findOne({ _id: decodedToken.userId });
    if (user.tokenVersion !== decodedToken.tokenVersion)
      throw new AuthenticationError("Wrong token version");

    // req.isAuth = true;
    req.userId = decodedToken.userId;
  } catch (err) {
    console.log(err);
    return false;
  }
  return true;
}
// };
