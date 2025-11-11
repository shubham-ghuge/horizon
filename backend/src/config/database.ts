import { connectPrisma, disconnectPrisma, checkDatabaseHealth } from './prisma';
import { connectMongo, disconnectMongo } from './mongo';
import { logger } from './logger';

export const connectDatabase = async () => {
  logger.info('Connecting to databases...');

  // Connect to PostgreSQL via Prisma
  await connectPrisma();

  // Connect to MongoDB (optional)
  await connectMongo();

  logger.info('All databases connected');
};

export const disconnectDatabase = async () => {
  logger.info('Disconnecting from databases...');

  await disconnectPrisma();
  await disconnectMongo();

  logger.info('All databases disconnected');
};

export const checkAllDatabasesHealth = async () => {
  const prismaHealth = await checkDatabaseHealth();

  return {
    prisma: prismaHealth,
    timestamp: new Date().toISOString(),
  };
};
