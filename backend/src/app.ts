import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { swaggerServe, swaggerSetup, getOpenApiDoc } from './config/swagger';
import { errorHandler } from './common/middlewares/error-handler';
import { registerRoutes } from './routes';
import { initializeGraphQL } from './graphql/server';
import { logger } from './config/logger';

export const createApp = () => {
  const app = express();

  // Security & Middleware
  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Request logging
  app.use((req, res, next) => {
    const startTimeMs = Date.now();
    res.on('finish', () => {
      const durationMs = Date.now() - startTimeMs;
      const details = {
        method: req.method,
        url: req.originalUrl,
        statusCode: res.statusCode,
        durationMs,
        ip: req.ip,
        userAgent: req.get('user-agent'),
      };
      if (res.statusCode >= 500) {
        logger.error(`HTTP ${req.method} ${req.originalUrl}`, details);
      } else if (res.statusCode >= 400) {
        logger.warn(`HTTP ${req.method} ${req.originalUrl}`, details);
      } else {
        logger.info(`HTTP ${req.method} ${req.originalUrl}`, details);
      }
    });
    next();
  });

  // Health check
  app.get('/healthz', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // API Documentation
  try {
    // Relax Helmet headers for Swagger UI only (avoid CSP issues)
    app.use(
      '/api/docs',
      helmet({
        contentSecurityPolicy: false,
        crossOriginEmbedderPolicy: false,
      })
    );
    // Expose raw JSON for debugging/editors
    app.get('/api/docs.json', (req, res) => {
      res.json(getOpenApiDoc() ?? {});
    });
    app.use('/api/docs', swaggerServe, swaggerSetup);
    logger.info('Swagger documentation loaded');
  } catch (error) {
    logger.warn('Swagger documentation not available', error as Error);
  }

  // Register all feature routes
  registerRoutes(app);

  // GraphQL initialization (async)
  initializeGraphQL(app).catch((error: Error) => {
    logger.warn('GraphQL server initialization failed', error);
  });

  // Error handling (must be last)
  app.use(errorHandler);

  return app;
};
