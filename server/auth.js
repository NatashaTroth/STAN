// // import { User } from "./models/User";
// import jwt from "jsonwebtoken";

// /**
//  * Creates and returns a json token, containing the user id. Used as short term access token for authentication.
//  * @param {object} user
//  */
// export const createAccessToken = user => {
//   return jwt.sign({ userId: user.id }, process.env.ACCESS_TOKEN_SECRET, {
//     expiresIn: "15m"
//   });
// };

// /**
//  * Creates and returns json token, containing the user id and tokenversion. Used as a refreshtoken for authentication.
//  * @param {object} user
//  */
// export const createRefreshToken = user => {
//   return jwt.sign(
//     { userId: user.id, tokenVersion: user.tokenVersion },
//     process.env.REFRESH_TOKEN_SECRET,
//     {
//       expiresIn: "7d"
//     }
//   );
// };
