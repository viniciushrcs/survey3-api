import {
  badRequest,
  ok,
  serverError,
  unauthorized
} from '../../../../src/presentation/helpers/http/http-helper';
import { LoginController } from '../../../../src/presentation/controllers/login/login';
import {
  Authentication,
  AuthenticationModel,
  AuthenticationParams,
  HttpRequest
} from '../../../../src/presentation/controllers/login/login-protocols';
import { MissingParamError } from '../../../../src/presentation/errors';
import { Validation } from '../../../../src/presentation/protocols';

interface SutTypes {
  sut: LoginController;
  validationStub: Validation;
  authenticationStub: Authentication;
}

const makeAuthenticationStub = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async authenticate(
      authentication: AuthenticationParams
    ): Promise<AuthenticationModel> {
      return Promise.resolve({ accessToken: 'any_token', name: 'any_name' });
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
      expect(authenticateSpy).toHaveBeenCalledWith({
        email: 'email@email.com',
        password: 'password'
      });
    });

    test('Should return 200 if valid credentials are provided', async () => {
      const { sut } = makeSut();
      const httpResponse = await sut.handle(makeFakeRequest());
      expect(httpResponse).toEqual(
        ok({
          accessToken: 'any_token',
          name: 'any_name'
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
