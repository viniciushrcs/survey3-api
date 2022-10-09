import { Middleware } from '../../../presentation/protocols';
import { AuthMiddleware } from '../../../presentation/middlewares/auth-middleware';
import { makeDbLoadAccountByToken } from '../usecases/db-load-account-by-token';

export const makeAuthMiddleware = (role?: string): Middleware => {
  const loadAccountByToken = makeDbLoadAccountByToken();
  return new AuthMiddleware(loadAccountByToken, role);
};
