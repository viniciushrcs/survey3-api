import { HttpRequest } from '../../protocols';
import { badRequest, serverError } from '../../helpers/http-helper';
import { InvalidParamError, MissingParamError } from '../../errors';
import { LoginController } from './login';
import { EmailValidator } from '../../protocols/email-validator';
import { Authentication } from '../../../domain/usecases/authentication';

interface SutTypes {
  sut: LoginController;
  emailValidatorStub: EmailValidator;
  authenticationStub: Authentication;
}

const makeAuthenticationStub = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async authenticate(email: string, password: string): Promise<string> {
      return new Promise((resolve) => resolve('any_token'));
    }
  }
  return new AuthenticationStub();
};

const makeEmailValidatorStub = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true;
    }
  }
  return new EmailValidatorStub();
};

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidatorStub();
  const authenticationStub = makeAuthenticationStub();
  const sut = new LoginController(emailValidatorStub, authenticationStub);
  return {
    sut,
    emailValidatorStub,
    authenticationStub
  };
};

const makeFakeRequest = (): HttpRequest => ({
  body: {
    email: 'email@email.com',
    password: 'password'
  }
});

describe('Login Controller', () => {
  describe('Request parameters validation', () => {
    test('Should return 400 if no email is provided', async () => {
      const { sut } = makeSut();
      const httpRequest: HttpRequest = {
        body: {
          password: 'password'
        }
      };
      const httpResponse = await sut.handle(httpRequest);
      expect(httpResponse).toEqual(badRequest(new MissingParamError('email')));
    });

    test('Should return 400 if no password is provided', async () => {
      const { sut } = makeSut();
      const httpRequest: HttpRequest = {
        body: {
          email: 'email'
        }
      };
      const httpResponse = await sut.handle(httpRequest);
      expect(httpResponse).toEqual(
        badRequest(new MissingParamError('password'))
      );
    });
  });

  describe('EmailValidator', () => {
    test('Should return 400 if an invalid email is provided', async () => {
      const { sut, emailValidatorStub } = makeSut();
      jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false);
      const httpResponse = await sut.handle(makeFakeRequest());
      expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')));
    });

    test('Should return 500 if emailValidator throws', async () => {
      const { sut, emailValidatorStub } = makeSut();
      jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
        throw new Error();
      });
      const httpResponse = await sut.handle(makeFakeRequest());
      expect(httpResponse).toEqual(serverError(new Error()));
    });

    test('Should call EmailValidator with valid email', async () => {
      const { sut, emailValidatorStub } = makeSut();
      const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid');
      await sut.handle(makeFakeRequest());
      expect(isValidSpy).toHaveBeenCalledWith('email@email.com');
    });
  });

  describe('Authentication', () => {
    test('Should call Authentication with correct values', async () => {
      const { sut, authenticationStub } = makeSut();
      const authenticateSpy = jest.spyOn(authenticationStub, 'authenticate');

      await sut.handle(makeFakeRequest());
      expect(authenticateSpy).toHaveBeenCalledWith(
        'email@email.com',
        'password'
      );
    });
  });
});
