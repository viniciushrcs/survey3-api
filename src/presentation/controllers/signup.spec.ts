import { SignupController } from './signup';
import { MissingParamError } from '../errors/missing-param-error';
import { InvalidParamError } from '../errors/invalid-param-error';
import { EmailValidator } from '../protocols/email-validator';

interface SutTypes {
  sut: SignupController;
  emailValidatorStub: EmailValidator;
}

// sut => System Under Test
const makeSut = (): SutTypes => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true;
    }
  }
  const emailValidatorStub = new EmailValidatorStub();
  const sut = new SignupController(emailValidatorStub);
  return {
    sut,
    emailValidatorStub
  };
};

describe('SignUpController', () => {
  test('Should return 400 if no name is provided', () => {
    const errorCode = 400;
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        email: 'email@email.com',
        password: 'password',
        passwordConfirmation: 'password'
      }
    };
    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(errorCode);
    expect(httpResponse.body).toEqual(new MissingParamError('name'));
  });

  test('Should return 400 if no email is provided', () => {
    const errorCode = 400;
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: 'name',
        password: 'password',
        passwordConfirmation: 'password'
      }
    };
    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(errorCode);
    expect(httpResponse.body).toEqual(new MissingParamError('email'));
  });

  test('Should return 400 if no password is provided', () => {
    const errorCode = 400;
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: 'name',
        email: 'email@email.com',
        passwordConfirmation: 'password'
      }
    };
    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(errorCode);
    expect(httpResponse.body).toEqual(new MissingParamError('password'));
  });

  test('Should return 400 if no passwordConfirmation is provided', () => {
    const errorCode = 400;
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: 'name',
        email: 'email@email.com',
        password: 'password'
      }
    };
    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(errorCode);
    expect(httpResponse.body).toEqual(
      new MissingParamError('passwordConfirmation')
    );
  });

  test('Should return 400 if email is not valid', () => {
    const errorCode = 400;
    const { sut, emailValidatorStub } = makeSut();
    const httpRequest = {
      body: {
        name: 'name',
        email: 'email@',
        password: 'password',
        passwordConfirmation: 'passwordConfirmation'
      }
    };
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false);
    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(errorCode);
    expect(httpResponse.body).toEqual(new InvalidParamError('email'));
  });
});
