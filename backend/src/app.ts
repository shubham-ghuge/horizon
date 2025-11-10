import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { swaggerServe, swaggerSetup } from './config/swagger';
import { errorHandler } from './common/middlewares/error-handler';
import { registerRoutes } from './routes';
import { initializeGraphQL } from './graphql/server';

export const createApp = () => {
  const app = express();
  initializeGraphQL(app);

  // Security & Middleware
  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Health check
  app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // API Documentation
  app.use('/api/docs', swaggerServe, swaggerSetup);

  // Register all feature routes
  registerRoutes(app);

  // Error handling (must be last)
  app.use(errorHandler);

  return app;
};
