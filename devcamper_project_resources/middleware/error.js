const ErrorResponse = require("../utils/errorResponse");

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  // log to console for dev
  console.log(err.stack.blue);
  console.log(err);

  // Mongoose bad ObjectId
  if (error.name === "CastError") {
    const message = `Resource not found with id of ${err.value}`;
    error = new ErrorResponse(message, 404);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = `Duplicate field value entered`;
    error = new ErrorResponse(message, 400);
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map(val => val.message);
    // const message = Object.values(err.errors);
    console.log("ERROR HERE");

    console.log(err.errors);
    console.log("LOG OBJECT");

    // console.log(Object.keys(err.errors));
    console.log(message);
    error = new ErrorResponse(message, 400);
  }

  // console.log(error.name);

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || "Server Error"
  });
};

module.exports = errorHandler;