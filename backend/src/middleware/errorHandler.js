/** Global error handler — returns consistent JSON errors */
export function errorHandler(err, _req, res, _next) {
  console.error(err);

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      message: 'Validation failed',
      errors: Object.values(err.errors).map((e) => e.message),
    });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({ message: 'Invalid ID format' });
  }

  if (err.code === 11000) {
    return res.status(409).json({ message: 'Duplicate entry', field: Object.keys(err.keyPattern || {})[0] });
  }

  const status = err.statusCode || 500;
  res.status(status).json({
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
}

/** 404 handler for unknown routes */
export function notFoundHandler(_req, res) {
  res.status(404).json({ message: 'Route not found' });
}

/** Async route wrapper to catch promise rejections */
export function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
