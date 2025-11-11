import { ApolloServer } from 'apollo-server-express';
import { readFileSync, existsSync } from 'fs';
import path from 'path';
import { resolvers } from './resolvers/index';
import { logger } from '../config/logger';

let apolloServer: ApolloServer | null = null;

try {
  const schemaPath = path.join(process.cwd(), 'src/graphql/schema.graphql');

  if (existsSync(schemaPath)) {
    const typeDefs = readFileSync(schemaPath, 'utf8');

    apolloServer = new ApolloServer({
      typeDefs,
      resolvers,
    });
  } else {
    logger.warn('GraphQL schema not found', { schemaPath });
  }
} catch (error) {
  logger.error('Failed to load GraphQL schema', error);
}

export const initializeGraphQL = async (app: any) => {
  if (!apolloServer) {
    logger.warn('GraphQL server not available');
    return;
  }

  try {
    await apolloServer.start();
    apolloServer.applyMiddleware({ app, path: '/graphql' });
    logger.info('GraphQL server initialized at /graphql');
  } catch (error) {
    logger.error('Failed to initialize GraphQL', error);
    throw error;
  }
};
