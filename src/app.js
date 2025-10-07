const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const config = require('./config');
const routes = require('./routes');
const { logger } = require('./lib/logger');
const { errorHandler, notFound } = require('./middleware');

const app = express();

app.use(helmet());
app.use(cors({
  origin: config.corsOrigin,
  credentials: true
}));

app.use(logger);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use('/api', routes);

app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Authentication API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      register: 'POST /api/v1/auth/register',
      login: 'POST /api/v1/auth/login',
      profile: 'GET /api/v1/auth/profile'
    }
  });
});

app.use(notFound);

app.use(errorHandler);

module.exports = app;