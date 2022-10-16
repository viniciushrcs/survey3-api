import { makeAuthMiddleware } from '../../factories/middlewares/auth-middleware';
import { getDirective, MapperKind, mapSchema } from '@graphql-tools/utils';
import { GraphQLSchema } from 'graphql';
import { ForbiddenError } from 'apollo-server-express';

export const authDirectiveTransformer = (
  schema: GraphQLSchema
): GraphQLSchema => {
  return mapSchema(schema, {
    [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
      const authDirective = getDirective(schema, fieldConfig, 'auth');
      if (authDirective) {
        const { resolve } = fieldConfig;
        fieldConfig.resolve = async (parent, args, context, info) => {
          const request = {
            headers: {
              'x-access-token': context?.req?.headers?.['x-access-token']
            }
          };
          const httpResponse = await makeAuthMiddleware().handle(request);
          if (httpResponse.statusCode === 200) {
            Object.assign(context?.req, httpResponse.body);
            return resolve.call(this, parent, args, context, info);
          } else {
            throw new ForbiddenError(httpResponse.body.message);
          }
        };
      }
      return fieldConfig;
    }
  });
};
