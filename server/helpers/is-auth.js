import jwt from "jsonwebtoken";
import { User } from "../models";
import { AuthenticationError } from "apollo-server";

export async function isAuth(req) {
  const authHeader = req.get("Authorization");
  if (!authHeader) return { isAuth: false, userId: "" }; //executes next function (if there is one)

  try {
    const token = authHeader.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if (!decodedToken) return { isAuth: false, userId: "" };

    const user = await User.findOne({ _id: decodedToken.userId });
    if (!user) throw new AuthenticationError("User does not exist");
    if (user.tokenVersion !== decodedToken.tokenVersion)
      throw new AuthenticationError("Wrong token version");

    return { isAuth: true, userId: decodedToken.userId, user };
  } catch (err) {
    console.error(err);
    return { isAuth: false, userId: "" };
  }
}
