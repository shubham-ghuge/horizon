import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

interface PrismaConfig {
  datasources?: {
    db?: {
      url: string;
    };
  };
  log?: any[];
  errorFormat?: 'pretty' | 'minimal' | 'colorless';
}

const getPrismaConfig = (): PrismaConfig => {
  const baseConfig: PrismaConfig = {
    errorFormat: process.env.NODE_ENV === 'production' ? 'minimal' : 'pretty',
  };

  // Configure logging based on environment
  if (process.env.NODE_ENV === 'development') {
    baseConfig.log = [
      { emit: 'event', level: 'query' },
      { emit: 'stdout', level: 'error' },
      { emit: 'stdout', level: 'info' },
      { emit: 'stdout', level: 'warn' },
    ];
  } else {
    baseConfig.log = ['error', 'warn'];
  }

  // Custom database URL with connection pooling
  if (process.env.DATABASE_URL) {
    const url = new URL(process.env.DATABASE_URL);

    // Add connection pool parameters
    url.searchParams.set('connection_limit', '10');
    url.searchParams.set('pool_timeout', '20');

    // For PostgreSQL
    if (url.protocol === 'postgresql:') {
      url.searchParams.set('pgbouncer', 'true');
      url.searchParams.set('connect_timeout', '10');
    }

    baseConfig.datasources = {
      db: { url: url.toString() },
    };
  }

  return baseConfig;
};

const createPrismaClient = () => {
  const config = getPrismaConfig();

  if (!global.prisma) {
    global.prisma = new PrismaClient(config as any);

    // Query logging in development
    if (process.env.NODE_ENV === 'development') {
      global.prisma.$on('query' as never, (e: any) => {
        console.log(`\x1b[36m[Prisma Query]\x1b[0m ${e.query}`);
        console.log(`\x1b[33m[Duration]\x1b[0m ${e.duration}ms`);
        if (e.params) {
          console.log(`\x1b[35m[Params]\x1b[0m ${e.params}`);
        }
      });

      global.prisma.$on('error' as never, (e: any) => {
        console.error('\x1b[31m[Prisma Error]\x1b[0m', e);
      });
    }
  }

  return global.prisma;
};

export const prisma = createPrismaClient();

// Connection with retry logic
export const connectPrisma = async (maxRetries = 5, retryDelay = 5000) => {
  let retries = 0;

  while (retries < maxRetries) {
    try {
      await prisma.$connect();
      console.log('✅ Prisma connected to database');

      // Verify connection
      await prisma.$queryRaw`SELECT 1`;
      console.log('✅ Database connection verified');

      return;
    } catch (error) {
      retries++;
      console.error(
        `❌ Failed to connect to database (attempt ${retries}/${maxRetries}):`,
        error
      );

      if (retries >= maxRetries) {
        console.error('❌ Max retries reached. Exiting...');
        process.exit(1);
      }

      console.log(`⏳ Retrying in ${retryDelay / 1000} seconds...`);
      await new Promise((resolve) => setTimeout(resolve, retryDelay));
    }
  }
};

export const disconnectPrisma = async () => {
  try {
    await prisma.$disconnect();
    console.log('✅ Prisma disconnected');
  } catch (error) {
    console.error('❌ Error disconnecting Prisma:', error);
  }
};

// Database health check
export const checkDatabaseHealth = async (): Promise<boolean> => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    console.error('Database health check failed:', error);
    return false;
  }
};

// Graceful shutdown handlers
const cleanup = async () => {
  console.log('\n🔄 Shutting down gracefully...');
  await disconnectPrisma();
};

process.on('beforeExit', cleanup);
process.on('SIGINT', async () => {
  await cleanup();
  process.exit(0);
});
process.on('SIGTERM', async () => {
  await cleanup();
  process.exit(0);
});

// Unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
