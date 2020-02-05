// import { User } from "./models/User";
import jwt from "jsonwebtoken";

export const createAccessToken = user => {
  return jwt.sign({ userId: user.id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m"
  });
};

export const createRefreshToken = user => {
  return jwt.sign({ userId: user.id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d"
  });
};
