import { connectDatabase } from './config/database';
import { Request, Response } from 'express';
import { createApp } from './app';

const start = async () => {
  try {
    // Connect to all databases
    await connectDatabase();

    // Your app initialization
    const app = createApp();

    // Health check endpoint
    app.get('/api/healthz', (_req: Request, res: Response): void => {
      res.json({ ok: true });
    });

    app.listen(process.env.PORT || 4000, () => {
      console.log(`Server is running on port ${process.env.PORT || 4000}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

start();
