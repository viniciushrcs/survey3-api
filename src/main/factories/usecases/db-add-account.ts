import { DbAddAccount } from '../../../data/usecases/add-account/db-add-account';
import env from '../../config/env';
import { BcryptAdapter } from '../../../infra/crypto/bcrypt-adapter/bcrypt-adapter';
import { AccountMongoRepository } from '../../../infra/db/mongodb/account-repository/account';

export const makeDbAddAccount = (): DbAddAccount => {
  const bcryptAdapter = new BcryptAdapter(env.salt);
  const accountMongoRepository = new AccountMongoRepository();
  return new DbAddAccount(bcryptAdapter, accountMongoRepository);
};
