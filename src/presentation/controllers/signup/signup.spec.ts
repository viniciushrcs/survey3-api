import { SignupController } from './signup';
import {
  InvalidParamError,
  MissingParamError,
  ServerError
} from '../../errors';
import {
  AccountModel,
  AddAccount,
  AddAccountModel,
  EmailValidator
} from './signup-protocols';

interface SutTypes {
  sut: SignupController;
  emailValidatorStub: EmailValidator;
  addAccountStub: AddAccount;
}

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    add(account: AddAccountModel): AccountModel {
      const newAccount = {
        id: 'aa672452-0ca0-468d-b321-f724adab617e',
        name: 'crash',
        email: 'email@email.com',
        password: 'mGcMhu6P'
      };
      return newAccount;
    }
  }
  return new AddAccountStub();
};

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
  const addAccountStub = makeAddAccount();
  const sut = new SignupController(emailValidatorStub, addAccountStub);
  return {
    sut,
    emailValidatorStub,
    addAccountStub
  };
};

describe('SignUpController', () => {
  describe('Request parameters validation', () => {
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

    test('Should return 400 if password and passwordConfirmation are not strict equal', () => {
      const errorCode = 400;
      const { sut } = makeSut();
      const httpRequest = {
        body: {
          name: 'name',
          email: 'email@',
          password: 'password',
          passwordConfirmation: 'different_password'
        }
      };
      const httpResponse = sut.handle(httpRequest);
      expect(httpResponse.statusCode).toBe(errorCode);
      expect(httpResponse.body).toEqual(
        new InvalidParamError('passwordConfirmation')
      );
    });
  });

  describe('EmailValidator', () => {
    test('Should return 400 if email is not valid', () => {
      const errorCode = 400;
      const { sut, emailValidatorStub } = makeSut();
      const httpRequest = {
        body: {
          name: 'name',
          email: 'email@',
          password: 'password',
          passwordConfirmation: 'password'
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
          passwordConfirmation: 'password'
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
          passwordConfirmation: 'password'
        }
      };
      const httpResponse = sut.handle(httpRequest);
      expect(httpResponse.statusCode).toBe(errorCode);
      expect(httpResponse.body).toEqual(new ServerError());
    });
  });

  describe('AddAccount', () => {
    // O AddAccount é uma regra de negócio, um caso de uso do sistema
    // Sua implementação fica em outra camada, não fica na Presentation Layer
    test('Should call AddAccount with correct values', () => {
      const { sut, addAccountStub } = makeSut();
      const addAccountSpy = jest.spyOn(addAccountStub, 'add');
      const httpRequest = {
        body: {
          name: 'name',
          email: 'email@email.com',
          password: 'password',
          passwordConfirmation: 'password'
        }
      };
      sut.handle(httpRequest);
      expect(addAccountSpy).toHaveBeenCalledWith({
        name: 'name',
        email: 'email@email.com',
        password: 'password'
      });
    });
    test('Should return 500 if AddAccount throws', () => {
      const errorCode = 500;
      const { sut, addAccountStub } = makeSut();
      jest.spyOn(addAccountStub, 'add').mockImplementationOnce(() => {
        throw new Error();
      });
      const httpRequest = {
        body: {
          name: 'name',
          email: 'email@',
          password: 'password',
          passwordConfirmation: 'password'
        }
      };
      const httpResponse = sut.handle(httpRequest);
      expect(httpResponse.statusCode).toBe(errorCode);
      expect(httpResponse.body).toEqual(new ServerError());
    });
    test('Should return 200 if AddAccount is called properly', () => {
      const { sut } = makeSut();
      const httpRequest = {
        body: {
          name: 'crash',
          email: 'email@email.com',
          password: 'mGcMhu6P',
          passwordConfirmation: 'mGcMhu6P'
        }
      };
      const httpResponse = sut.handle(httpRequest);
      expect(httpResponse.statusCode).toBe(200);
      expect(httpResponse.body).toEqual({
        id: 'aa672452-0ca0-468d-b321-f724adab617e',
        name: 'crash',
        email: 'email@email.com',
        password: 'mGcMhu6P'
      });
    });
  });
});
