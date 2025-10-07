const app = require('./src/app');
const config = require('./src/config');
const { log } = require('./src/lib/logger');

process.on('uncaughtException', (err) => {
  log.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  log.error('Unhandled Rejection:', err);
  process.exit(1);
});

const server = app.listen(config.port, () => {
  log.info(`🚀 Server running on port ${config.port}`);
  log.info(`📱 Environment: ${config.nodeEnv}`);
  log.info(`🌐 API Base URL: http://localhost:${config.port}/api`);
  log.info(`📋 Health Check: http://localhost:${config.port}/api/health`);
  log.info(`📖 API Docs: http://localhost:${config.port}/`);
});


process.on('SIGINT', () => {
  log.info('SIGINT received. Shutting down gracefully...');
  server.close(() => {
    log.info('Process terminated');
    process.exit(0);
  });
});