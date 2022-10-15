import { DbAuthentication } from '../../../data/usecases/authentication/db-authentication';
import { AccountMongoRepository } from '../../../infra/db/mongodb/account-repository/account';
import { BcryptAdapter } from '../../../infra/crypto/bcrypt-adapter';
import { JwtAdapter } from '../../../infra/crypto/jwt-adapter';
import env from '../../config/env';

export const makeDbAuthentication = (): DbAuthentication => {
  const accountMongoRepository = new AccountMongoRepository();
  const bcryptAdapter = new BcryptAdapter(env.salt);
  const jwtAdapter = new JwtAdapter(env.secret);
  return new DbAuthentication(
    accountMongoRepository,
    bcryptAdapter,
    jwtAdapter,
    accountMongoRepository
  );
};
