import {
  badRequest,
  ok,
  serverError,
  unauthorized
} from '../../helpers/http/http-helper';
import { LoginController } from './login';
import { Authentication, HttpRequest } from './login-protocols';
import { MissingParamError } from '../../errors';
import { Validation } from '../../protocols';

interface SutTypes {
  sut: LoginController;
  validationStub: Validation;
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

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate(input: any): Error {
      return null;
    }
  }
  return new ValidationStub();
};

const makeSut = (): SutTypes => {
  const validationStub = makeValidation();
  const authenticationStub = makeAuthenticationStub();
  const sut = new LoginController(validationStub, authenticationStub);
  return {
    sut,
    validationStub,
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
  describe('Authentication', () => {
    test('Should return 401 if invalid credentials are provided', async () => {
      const { sut, authenticationStub } = makeSut();
      jest
        .spyOn(authenticationStub, 'authenticate')
        .mockResolvedValueOnce(null);
      const httpResponse = await sut.handle(makeFakeRequest());
      expect(httpResponse).toEqual(unauthorized());
    });

    test('Should return 500 if Authentication throws', async () => {
      const { sut, authenticationStub } = makeSut();
      jest
        .spyOn(authenticationStub, 'authenticate')
        .mockRejectedValueOnce(new Error());
      const httpResponse = await sut.handle(makeFakeRequest());
      expect(httpResponse).toEqual(serverError(new Error()));
    });

    test('Should call Authentication with correct values', async () => {
      const { sut, authenticationStub } = makeSut();
      const authenticateSpy = jest.spyOn(authenticationStub, 'authenticate');

      await sut.handle(makeFakeRequest());
      expect(authenticateSpy).toHaveBeenCalledWith(
        'email@email.com',
        'password'
      );
    });

    test('Should return 200 if valid credentials are provided', async () => {
      const { sut } = makeSut();
      const httpResponse = await sut.handle(makeFakeRequest());
      expect(httpResponse).toEqual(
        ok({
          authToken: 'any_token'
        })
      );
    });
  });

  describe('Validation', () => {
    test('Should call Validation with correct values', async () => {
      const { sut, validationStub } = makeSut();
      const validateSpy = jest.spyOn(validationStub, 'validate');
      await sut.handle(makeFakeRequest());
      expect(validateSpy).toHaveBeenCalledWith(makeFakeRequest().body);
    });

    test('Should return 400 if Validation is returns an error', async () => {
      const { sut, validationStub } = makeSut();
      jest
        .spyOn(validationStub, 'validate')
        .mockReturnValueOnce(new MissingParamError('any_field'));
      const httpResponse = await sut.handle(makeFakeRequest());
      expect(httpResponse).toEqual(
        badRequest(new MissingParamError('any_field'))
      );
    });
  });
});
