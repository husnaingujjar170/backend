const { response } = require('../lib');
const { HTTP_STATUS } = require('../constants');

const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  if (err.code === 'P2002') {
    return response.error(res, 'Duplicate entry found', HTTP_STATUS.BAD_REQUEST);
  }

  if (err.code === 'P2025') {
    return response.error(res, 'Record not found', HTTP_STATUS.NOT_FOUND);
  }
  if (err.name === 'JsonWebTokenError') {
    return response.error(res, 'Invalid token', HTTP_STATUS.UNAUTHORIZED);
  }

  if (err.name === 'TokenExpiredError') {
    return response.error(res, 'Token expired', HTTP_STATUS.UNAUTHORIZED);
  }

  return response.error(
    res, 
    err.message || 'Internal server error', 
    err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR
  );
};

const notFound = (req, res) => {
  return response.error(res, 'Route not found', HTTP_STATUS.NOT_FOUND);
};

module.exports = {
  errorHandler,
  notFound
};