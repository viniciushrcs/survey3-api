import { ApolloServer } from 'apollo-server-express';
import { Express } from 'express';
import resolvers from '../graphql/resolvers';
import typeDefs from '../graphql/type-defs';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { authDirectiveTransformer } from '../graphql/directives';

let schema = makeExecutableSchema({ resolvers, typeDefs });
schema = authDirectiveTransformer(schema);

export default async (app: Express): Promise<void> => {
  const server = new ApolloServer({
    schema,
    context: ({ req }) => ({ req })
  });
  await server.start();
  server.applyMiddleware({ app });
};
