import 'reflect-metadata';
import 'dotenv/config';
import { connectDatabase } from './config/database';
import { createApp } from './app';
import { logger } from './config/logger';

const start = async () => {
  try {
    logger.info('Starting TurbineOps backend...');

    // Connect to all databases
    await connectDatabase();

    // Your app initialization
    const app = createApp();

    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
      logger.info(`API Docs available`, { url: `http://localhost:${PORT}/api/docs` });
      logger.info(`GraphQL available`, { url: `http://localhost:${PORT}/graphql` });
    });
  } catch (error) {
    logger.error('Failed to start server', error);
    logger.error('Stack trace', { stack: (error as Error).stack });
    process.exit(1);
  }
};

start();
