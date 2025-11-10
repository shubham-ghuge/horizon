import { ApolloServer } from 'apollo-server-express';
import { readFileSync } from 'fs';
import path from 'path';
import { resolvers } from './resolvers';

const typeDefs = readFileSync(
  path.join(process.cwd(), 'src/graphql/schema.graphql'),
  'utf8'
);

export const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
});

export const initializeGraphQL = async (app: any) => {
  await apolloServer.start();
  apolloServer.applyMiddleware({ app, path: '/graphql' });
  console.log('GraphQL server initialized at /graphql');
};
