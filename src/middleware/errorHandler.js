// Catches any route that doesn't exist.
function notFound(req, res, next) {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found.`,
  });
}

// Catches any error thrown/passed via next(err) anywhere in the app.
function errorHandler(err, req, res, next) {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
}

module.exports = { notFound, errorHandler };
