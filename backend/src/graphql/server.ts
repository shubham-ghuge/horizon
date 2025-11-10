import { ApolloServer } from 'apollo-server-express';
import { readFileSync, existsSync } from 'fs';
import path from 'path';
import { resolvers } from './resolvers/index';

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
    console.warn('⚠️  GraphQL schema not found at:', schemaPath);
  }
} catch (error) {
  console.error('Failed to load GraphQL schema:', (error as Error).message);
}

export const initializeGraphQL = async (app: any) => {
  if (!apolloServer) {
    console.log('⚠️  GraphQL server not available');
    return;
  }

  try {
    await apolloServer.start();
    apolloServer.applyMiddleware({ app, path: '/graphql' });
    console.log('✅ GraphQL server initialized at /graphql');
  } catch (error) {
    console.error('Failed to initialize GraphQL:', (error as Error).message);
    throw error;
  }
};
