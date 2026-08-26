// backend/server.js
import 'dotenv/config';
import app from './src/app.js';
import logger from './src/utils/logger.js';

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

const server = app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT} (${NODE_ENV})`);
});

process.on('unhandledRejection', (err) => {
  logger.error(`Unhandled Rejection: ${err?.message || err}`);
  server.close(() => process.exit(1));
});

process.on('uncaughtException', (err) => {
  logger.error(`Uncaught Exception: ${err?.message || err}`);
  server.close(() => process.exit(1));
});

export default server;
