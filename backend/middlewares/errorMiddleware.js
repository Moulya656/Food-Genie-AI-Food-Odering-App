module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  if (err.name === "CastError") {
    err.statusCode = 404;
    err.message = `Resource not found: invalid ${err.path}`;
  }
  if (err.code === 11000) {
    err.statusCode = 400;
    err.message = `Duplicate value entered for ${Object.keys(err.keyValue)}`;
  }
  if (err.name === "JsonWebTokenError") {
    err.statusCode = 401;
    err.message = "Invalid authentication token, please log in again";
  }
  if (err.name === "TokenExpiredError") {
    err.statusCode = 401;
    err.message = "Session expired, please log in again";
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};
