const { authenticate } = require('./auth.middleware');
const { validate } = require('./validation.middleware');
const { errorHandler, notFound } = require('./error.middleware');

module.exports = {
  authenticate,
  validate,
  errorHandler,
  notFound
};