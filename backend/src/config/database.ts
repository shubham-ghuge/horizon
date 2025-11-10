import { connectPrisma, disconnectPrisma, checkDatabaseHealth } from './prisma';
import { connectMongo, disconnectMongo } from './mongo';

export const connectDatabase = async () => {
  console.log('🔌 Connecting to databases...');

  // Connect to PostgreSQL via Prisma
  await connectPrisma();

  // Connect to MongoDB (optional)
  await connectMongo();

  console.log('✅ All databases connected');
};

export const disconnectDatabase = async () => {
  console.log('🔌 Disconnecting from databases...');

  await disconnectPrisma();
  await disconnectMongo();

  console.log('✅ All databases disconnected');
};

export const checkAllDatabasesHealth = async () => {
  const prismaHealth = await checkDatabaseHealth();

  return {
    prisma: prismaHealth,
    timestamp: new Date().toISOString(),
  };
};
