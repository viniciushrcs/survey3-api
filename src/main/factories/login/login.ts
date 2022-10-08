import { LogErrorDecorator } from '../../decorators/log-error';
import { LogMongoRepository } from '../../../infra/db/mongodb/logger-repository/log';
import { Controller } from '../../../presentation/protocols';
import { makeLoginValidation } from './login-validation';
import { LoginController } from '../../../presentation/controllers/login/login';
import { DbAuthentication } from '../../../data/usecases/authentication/db-authentication';
import { JwtAdapter } from '../../../infra/crypto/jwt-adapter/jwt-adapter';
import { AccountMongoRepository } from '../../../infra/db/mongodb/account-repository/account';
import { BcryptAdapter } from '../../../infra/crypto/bcrypt-adapter/bcrypt-adapter';
import env from '../../config/env';

export const makeLoginController = (): Controller => {
  const accountMongoRepository = new AccountMongoRepository();
  const bcryptAdapter = new BcryptAdapter(env.salt);
  const jwtAdapter = new JwtAdapter(env.secret);
  const dbAuthentication = new DbAuthentication(
    accountMongoRepository,
    bcryptAdapter,
    jwtAdapter,
    accountMongoRepository
  );
  const loginController = new LoginController(
    makeLoginValidation(),
    dbAuthentication
  );
  const logMongoRepository = new LogMongoRepository();
  return new LogErrorDecorator(loginController, logMongoRepository);
};
