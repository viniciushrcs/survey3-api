import { EmailValidation } from '../../../src/validation/validators';
import { EmailValidator } from '../../../src/validation/protocols/email-validator';
import { InvalidParamError } from '../../../src/presentation/errors';

interface SutTypes {
  emailValidatorStub: EmailValidator;
  sut: EmailValidation;
}

const makeEmailValidatorStub = () => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true;
    }
  }
  return new EmailValidatorStub();
};

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidatorStub();
  const sut = new EmailValidation('email', emailValidatorStub);
  return {
    emailValidatorStub,
    sut
  };
};

describe('Email Validation', () => {
  test('Should return an error if EmailValidator returns false', () => {
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false);
    const emailValidatorReturn = sut.validate({ email: 'email' });
    expect(emailValidatorReturn).toEqual(new InvalidParamError('email'));
  });

  test('Should call emailValidator with correct email', async () => {
    const { sut, emailValidatorStub } = makeSut();
    const isValidEmailSpy = jest.spyOn(emailValidatorStub, 'isValid');
    sut.validate({ email: 'email@email.com' });
    expect(isValidEmailSpy).toHaveBeenCalledWith('email@email.com');
  });

  test('Should throw if emailValidator throws', async () => {
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error();
    });
    expect(sut.validate).toThrow();
  });
});
