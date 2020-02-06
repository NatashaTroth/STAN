//TODO: Change 'refresh_token' name

export const sendRefreshToken = (res, token) => {
  console.log("sending refresh token—");
  res.cookie("refresh_token", token, {
    httpOnly: true
    // path: "/refresh_token"
  });
};
