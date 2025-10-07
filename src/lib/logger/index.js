const morgan = require('morgan');

const morganFormat = ':method :url :status :res[content-length] - :response-time ms';

const logger = morgan(morganFormat, {
  skip: (req, res) => {
    return process.env.NODE_ENV === 'test';
  }
});

const log = {
  info: (message, data = {}) => {
    console.log(`[INFO] ${message}`, data);
  },
  error: (message, error = {}) => {
    console.error(`[ERROR] ${message}`, error);
  },
  warn: (message, data = {}) => {
    console.warn(`[WARN] ${message}`, data);
  }
};

module.exports = {
  logger,
  log
};