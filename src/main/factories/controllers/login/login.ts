import { Controller } from '../../../../presentation/protocols';
import { makeLoginValidation } from './login-validation';
import { LoginController } from '../../../../presentation/controllers/login/login';
import { makeDbAuthentication } from '../../usecases/db-authentication';
import { makeLogErrorDecorator } from '../../decorators/log-error';

export const makeLoginController = (): Controller => {
  return makeLogErrorDecorator(
    new LoginController(makeLoginValidation(), makeDbAuthentication())
  );
};
