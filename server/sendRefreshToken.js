//TODO: Change 'refresh_token' name

export const sendRefreshToken = (res, token) => {
  // console.log("sending refresh token");
  //TODO: allow to expire cookie - so when logout - it deletes the cookie
  //TODO: rename refresh_token
  res.cookie("refresh_token", token, {
    httpOnly: true
    // path: "/refresh_token"
  });
};
