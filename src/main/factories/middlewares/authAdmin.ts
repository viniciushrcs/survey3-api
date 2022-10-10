import { adaptMiddleware } from '../../adapters/express-middleware-adapter';
import { makeAuthMiddleware } from './auth-middleware';

export const authAdmin = adaptMiddleware(makeAuthMiddleware('admin'));
