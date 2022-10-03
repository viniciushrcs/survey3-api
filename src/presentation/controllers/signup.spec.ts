import { SignupController } from './signup';
import { InvalidParamError, MissingParamError, ServerError } from '../errors';
import { EmailValidator } from '../protocols';

interface SutTypes {
  sut: SignupController;
  emailValidatorStub: EmailValidator;
}

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string) {
      return true;
    }
  }
  return new EmailValidatorStub();
};

// sut => System Under Test
const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator();
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

  test('Should call emailValidator with correct email', () => {
    const { sut, emailValidatorStub } = makeSut();
    const isValidEmailSpy = jest.spyOn(emailValidatorStub, 'isValid');
    const httpRequest = {
      body: {
        name: 'name',
        email: 'email@email.com',
        password: 'password',
        passwordConfirmation: 'passwordConfirmation'
      }
    };
    sut.handle(httpRequest);
    expect(isValidEmailSpy).toHaveBeenCalledWith('email@email.com');
  });

  test('Should return 500 if emailValidator throws', () => {
    const errorCode = 500;
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error();
    });
    const httpRequest = {
      body: {
        name: 'name',
        email: 'email@',
        password: 'password',
        passwordConfirmation: 'passwordConfirmation'
      }
    };
    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(errorCode);
    expect(httpResponse.body).toEqual(new ServerError());
  });
});
