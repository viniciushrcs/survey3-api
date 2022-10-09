import { AccountMongoRepository } from '../../../infra/db/mongodb/account-repository/account';
import { DbLoadAccountByToken } from '../../../data/usecases/load-account-by-token/db-load-account-by-token';
import { JwtAdapter } from '../../../infra/crypto/jwt-adapter/jwt-adapter';
import env from '../../config/env';

export const makeDbLoadAccountByToken = (): DbLoadAccountByToken => {
  const accountMongoRepository = new AccountMongoRepository();
  const jwtAdapter = new JwtAdapter(env.secret);
  return new DbLoadAccountByToken(jwtAdapter, accountMongoRepository);
};
