import { SignupController } from '../../../../presentation/controllers/signup/signup';
import { Controller } from '../../../../presentation/protocols';
import { makeSignUpValidation } from './signup-validation';
import { makeDbAuthentication } from '../../usecases/db-authentication';
import { makeDbAddAccount } from '../../usecases/db-add-account';
import { makeLogErrorDecorator } from '../../decorators/log-error';

export const makeSignUpController = (): Controller => {
  return makeLogErrorDecorator(
    new SignupController(
      makeDbAddAccount(),
      makeSignUpValidation(),
      makeDbAuthentication()
    )
  );
};
