const httpStatus = {
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  INTERNAL_ERROR: 500,
};

function notFoundHandler(_req, res, next) {
  const error = new Error('Route not found');
  error.status = httpStatus.NOT_FOUND;
  next(error);
}

function errorHandler(err, _req, res, _next) {
  const status = err.status || httpStatus.INTERNAL_ERROR;
  const payload = {
    message: err.message || 'Unexpected server error',
  };

  if (process.env.NODE_ENV !== 'production' && err.stack) {
    payload.stack = err.stack;
  }

  res.status(status).json(payload);
}

module.exports = {
  notFoundHandler,
  errorHandler,
};
