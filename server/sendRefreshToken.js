//TODO: Change 'refresh-token' name

export const sendRefreshToken = (res, token) => {
  res.cookie("refresh-token", token, {
    httpOnly: true
  });
};
