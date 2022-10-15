import {
  EmailValidation,
  RequiredFieldValidation,
  ValidationComposite
} from '../../../../src/validation/validators';
import { Validation } from '../../../../src/presentation/protocols';
import { EmailValidator } from '../../../../src/validation/protocols/email-validator';
import { makeLoginValidation } from '../../../../src/main/factories/controllers/login/login-validation';

jest.mock('../../../../src/validation/validators/validation-composite');

const makeEmailValidatorStub = () => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true;
    }
  }
  return new EmailValidatorStub();
};

describe('Login Validation Factory', () => {
  test('Should call ValidationComposite with all validations ', () => {
    makeLoginValidation();
    const validations: Validation[] = [];
    for (const field of ['email', 'password']) {
      validations.push(new RequiredFieldValidation(field));
    }
    validations.push(new EmailValidation('email', makeEmailValidatorStub()));
    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
