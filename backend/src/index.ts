import 'reflect-metadata';
import 'dotenv/config';
import { connectDatabase } from './config/database';
import { createApp } from './app';

const start = async () => {
  try {
    console.log('🚀 Starting TurbineOps backend...');

    // Connect to all databases
    await connectDatabase();

    // Your app initialization
    const app = createApp();

    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
      console.log(`✅ Server is running on port ${PORT}`);
      console.log(`📚 API Docs: http://localhost:${PORT}/api/docs`);
      console.log(`🔍 GraphQL: http://localhost:${PORT}/graphql`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    console.error('Stack trace:', (error as Error).stack);
    process.exit(1);
  }
};

start();
