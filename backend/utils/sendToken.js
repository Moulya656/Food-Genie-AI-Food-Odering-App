module.exports = (user, statusCode, res) => {
  const token = user.getSignedToken();

  const options = {
    expires: new Date(
      Date.now() + (process.env.COOKIE_EXPIRES_DAYS || 7) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    sameSite: "lax",
  };

  const safeUser = user.toObject();
  delete safeUser.password;

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    token,
    user: safeUser,
  });
};
