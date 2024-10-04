const errorHandler = (err, req, res, next) => {
  // Log the error for internal tracking
  console.error(err);

  // Handle other types of errors
  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
    error: err.message, // Optionally include the error message
  });
};

export default errorHandler;
