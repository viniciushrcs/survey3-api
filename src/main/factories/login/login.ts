import { LogErrorDecorator } from '../../decorators/log-error';
import { LogMongoRepository } from '../../../infra/db/mongodb/logger-repository/log';
import { Controller } from '../../../presentation/protocols';
import { makeLoginValidation } from './login-validation';
import { LoginController } from '../../../presentation/controllers/login/login';

export const makeLoginController = (): Controller => {
  const loginController = new LoginController(makeLoginValidation());
  const logMongoRepository = new LogMongoRepository();
  return new LogErrorDecorator(loginController, logMongoRepository);
};
