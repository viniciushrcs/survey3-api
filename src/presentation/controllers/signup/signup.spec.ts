import { SignupController } from './signup';
import { MissingParamError, ServerError } from '../../errors';
import {
  AccountModel,
  AddAccount,
  AddAccountModel,
  HttpRequest,
  Validation
} from './signup-protocols';
import { badRequest, ok, serverError } from '../../helpers/http/http-helper';
import {
  Authentication,
  AuthenticationModel
} from '../../../domain/usecases/authentication';

interface SutTypes {
  sut: SignupController;
  addAccountStub: AddAccount;
  validationStub: Validation;
  authenticationStub: Authentication;
}

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add(account: AddAccountModel): Promise<AccountModel> {
      const newAccount = makeFakeAccount();
      return new Promise((resolve) => resolve(newAccount));
    }
  }
  return new AddAccountStub();
};

const makeFakeAccount = (): AccountModel => ({
  id: 'aa672452-0ca0-468d-b321-f724adab617e',
  name: 'crash',
  email: 'email@email.com',
  password: 'mGcMhu6P'
});

const makeFakeRequest = (): HttpRequest => ({
  body: {
    name: 'crash',
    email: 'email@email.com',
    password: 'mGcMhu6P',
    passwordConfirmation: 'mGcMhu6P'
  }
});

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate(input: any): Error {
      return null;
    }
  }
  return new ValidationStub();
};

const makeAuthenticationStub = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async authenticate(authentication: AuthenticationModel): Promise<string> {
      return new Promise((resolve) => resolve('any_token'));
    }
  }
  return new AuthenticationStub();
};

const makeSut = (): SutTypes => {
  const addAccountStub = makeAddAccount();
  const validationStub = makeValidation();
  const authenticationStub = makeAuthenticationStub();
  const sut = new SignupController(
    addAccountStub,
    validationStub,
    authenticationStub
  );
  return {
    sut,
    addAccountStub,
    validationStub,
    authenticationStub
  };
};

describe('SignUpController', () => {
  describe('AddAccount', () => {
    // O AddAccount é uma regra de negócio, um caso de uso do sistema
    // Sua implementação fica em outra camada, não fica na Presentation Layer
    test('Should call AddAccount with correct values', async () => {
      const { sut, addAccountStub } = makeSut();
      const addAccountSpy = jest.spyOn(addAccountStub, 'add');
      await sut.handle(makeFakeRequest());
      expect(addAccountSpy).toHaveBeenCalledWith({
        name: 'crash',
        email: 'email@email.com',
        password: 'mGcMhu6P'
      });
    });

    test('Should return 500 if AddAccount throws', async () => {
      const { sut, addAccountStub } = makeSut();
      jest.spyOn(addAccountStub, 'add').mockRejectedValueOnce(async () => {
        throw new Error();
      });
      const httpResponse = await sut.handle(makeFakeRequest());
      expect(httpResponse).toEqual(serverError(new ServerError(null)));
    });

    test('Should return 200 if AddAccount is called properly', async () => {
      const { sut } = makeSut();
      const httpResponse = await sut.handle(makeFakeRequest());
      expect(httpResponse).toEqual(
        ok({
          accessToken: 'any_token',
          email: 'email@email.com',
          id: 'aa672452-0ca0-468d-b321-f724adab617e',
          name: 'crash',
          password: 'mGcMhu6P'
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

  describe('Authentication', () => {
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
        password: 'mGcMhu6P'
      });
    });
  });
});
