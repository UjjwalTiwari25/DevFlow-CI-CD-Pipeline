const { logger } = require('../utils/logger');
const { AppError } = require('../utils/errors');
const { config } = require('../config');

/**
 * Centralized error-handling middleware.
 * Catches all errors thrown in routes/services and sends a consistent JSON response.
 */
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, _next) {
  // Default to 500 for unexpected errors
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let errors = err.errors || null;

  // Prisma known request errors
  if (err.code === 'P2002') {
    statusCode = 409;
    message = 'A record with this value already exists';
  } else if (err.code === 'P2025') {
    statusCode = 404;
    message = 'Record not found';
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token has expired';
  }

  // Zod validation errors
  if (err.name === 'ZodError') {
    statusCode = 400;
    message = 'Validation failed';
    errors = err.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));
  }

  // Log error details
  if (statusCode >= 500) {
    logger.error(
      {
        err,
        method: req.method,
        url: req.url,
        statusCode,
      },
      'Unhandled server error'
    );
  } else {
    logger.warn(
      {
        method: req.method,
        url: req.url,
        statusCode,
        message,
      },
      'Client error'
    );
  }

  const response = {
    status: 'error',
    message,
    ...(errors && { errors }),
    ...(config.NODE_ENV === 'development' && statusCode >= 500 && { stack: err.stack }),
  };

  res.status(statusCode).json(response);
}

/**
 * 404 handler for routes that don't exist.
 */
function notFoundHandler(req, res, next) {
  next(new AppError(`Route ${req.method} ${req.url} not found`, 404));
}

module.exports = { errorHandler, notFoundHandler };
