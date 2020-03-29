import jwt from "jsonwebtoken";
import { User } from "../models";
import { AuthenticationError } from "apollo-server";

// module.exports = async (req, res, next) => {
export async function isAuth(req) {
  //req.isAuth -> new property in req
  // req.isAuth = false;
  console.log(req.get("Authorization"));
  const authHeader = req.get("Authorization");
  if (!authHeader) return { isAuth: false, userId: "" }; //executes next function (if there is one)

  try {
    const token = authHeader.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if (!decodedToken) return { isAuth: false, userId: "" };

    const user = await User.findOne({ _id: decodedToken.userId });
    if (user.tokenVersion !== decodedToken.tokenVersion)
      throw new AuthenticationError("Wrong token version");

    // req.isAuth = true;
    // req.userId = decodedToken.userId;

    return { isAuth: true, userId: decodedToken.userId };
  } catch (err) {
    console.log(err);
    return { isAuth: false, userId: "" };
  }
  // return {isAuth: t, userId: ""};
}
// };
