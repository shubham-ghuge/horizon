import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { swaggerServe, swaggerSetup } from './config/swagger';
import { errorHandler } from './common/middlewares/error-handler';
import { registerRoutes } from './routes';
import { initializeGraphQL } from './graphql/server';

export const createApp = () => {
  const app = express();

  // Security & Middleware
  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Health check
  app.get('/healthz', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // API Documentation
  try {
    app.use('/api/docs', swaggerServe, swaggerSetup);
    console.log('✅ Swagger documentation loaded');
  } catch (error) {
    console.warn(
      '⚠️  Swagger documentation not available:',
      (error as Error).message
    );
  }

  // Register all feature routes
  registerRoutes(app);

  // GraphQL initialization (async)
  initializeGraphQL(app).catch((error: Error) => {
    console.warn('⚠️  GraphQL server initialization failed:', error.message);
  });

  // Error handling (must be last)
  app.use(errorHandler);

  return app;
};
