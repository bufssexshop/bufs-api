export const errorHandler = (err, req, res, next) => {
  console.error('------- [API ERROR LOG] -------');
  console.error(err);
  console.error('-------------------------------');

  let statusCode = err.statusCode || 500;
  let response = {
    error: {
      code: err.code || 'INTERNAL_ERROR',
      message: err.message || 'Unexpected server error.',
    }
  };

  // 1. Joi Error handler (Schemas validation)
  if (err.isJoi) {
    statusCode = 400;
    response = {
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid input data.',
        details: err.details.map(d => d.message) // List with all Joi errors
      }
    };
  }

  // 2. MongoDB Error Handler (Duplicated fields)
  if (err.code === 11000) {
    statusCode = 409; // Conflict
    const field = Object.keys(err.keyValue)[0];
    response = {
      error: {
        code: 'DUPLICATE_ERROR',
        message: `The ${field} '${err.keyValue[field]}' is already in use.`,
      }
    };
  }

  // 3. WT Error Handler (Invalid tokens or expireds)
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    response.error.code = 'INVALID_TOKEN';
    response.error.message = 'The provided token is invalid.';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    response.error.code = 'TOKEN_EXPIRED';
    response.error.message = 'The token has expired. Please login again.';
  }

  res.status(statusCode).json(response);
};