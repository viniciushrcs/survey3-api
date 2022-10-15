import { makeSignUpValidation } from '../../../../src/main/factories/controllers/signup/signup-validation';
import {
  CompareFieldsValidation,
  EmailValidation,
  RequiredFieldValidation,
  ValidationComposite
} from '../../../../src/validation/validators';
import { Validation } from '../../../../src/presentation/protocols';
import { EmailValidator } from '../../../../src/validation/protocols/email-validator';

jest.mock('../../../../src/validation/validators/validation-composite');

const makeEmailValidatorStub = () => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true;
    }
  }
  return new EmailValidatorStub();
};

describe('SignUp Validation Factory', () => {
  test('Should call ValidationComposite with all validations ', () => {
    makeSignUpValidation();
    const validations: Validation[] = [];
    for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
      validations.push(new RequiredFieldValidation(field));
    }
    validations.push(
      new CompareFieldsValidation('password', 'passwordConfirmation')
    );
    validations.push(new EmailValidation('email', makeEmailValidatorStub()));
    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
