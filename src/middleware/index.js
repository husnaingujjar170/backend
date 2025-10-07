const { authenticate, authorize } = require('./auth.middleware');
const { validate } = require('./validation.middleware');
const { errorHandler, notFound } = require('./error.middleware');

module.exports = {
  authenticate,
  authorize,
  validate,
  errorHandler,
  notFound
};