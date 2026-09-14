// Catch-all 404 for unmatched routes
function notFound(req, res, next) {
  res.status(404).json({ success: false, message: "Route not found." });
}

// Central error handler — never leaks stack traces to the client.
function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  const isProduction = process.env.NODE_ENV === "production";

  if (!isProduction) {
    console.error(err);
  }

  res.status(status).json({
    success: false,
    message: status === 500 ? "Something went wrong. Please try again later." : err.message,
  });
}

module.exports = { notFound, errorHandler };
