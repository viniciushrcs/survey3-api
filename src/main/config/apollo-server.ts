import { ApolloServer } from 'apollo-server-express';
import { Express } from 'express';
import resolvers from '../graphql/resolvers';
import typeDefs from '../graphql/type-defs';

export default async (app: Express): Promise<void> => {
  const server = new ApolloServer({
    resolvers,
    typeDefs
  });
  await server.start();
  server.applyMiddleware({ app });
};
