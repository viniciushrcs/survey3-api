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
  EmailValidator,
  HttpRequest,
  Validation
} from './signup-protocols';
import { badRequest, ok, serverError } from '../../helpers/http-helper';

interface SutTypes {
  sut: SignupController;
  emailValidatorStub: EmailValidator;
  addAccountStub: AddAccount;
  validationStub: Validation;
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

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string) {
      return true;
    }
  }
  return new EmailValidatorStub();
};

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate(input: any): Error {
      return null;
    }
  }
  return new ValidationStub();
};

// sut => System Under Test
const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator();
  const addAccountStub = makeAddAccount();
  const validationStub = makeValidation();
  const sut = new SignupController(
    emailValidatorStub,
    addAccountStub,
    validationStub
  );
  return {
    sut,
    emailValidatorStub,
    addAccountStub,
    validationStub
  };
};

describe('SignUpController', () => {
  describe('Request parameters validation', () => {
    test('Should return 400 if password and passwordConfirmation are not strict equal', async () => {
      const { sut } = makeSut();
      const httpRequest = {
        body: {
          name: 'name',
          email: 'email@',
          password: 'password',
          passwordConfirmation: 'different_password'
        }
      };
      const httpResponse = await sut.handle(httpRequest);
      expect(httpResponse).toEqual(
        badRequest(new InvalidParamError('passwordConfirmation'))
      );
    });
  });

  describe('EmailValidator', () => {
    test('Should return 400 if email is not valid', async () => {
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
      const httpResponse = await sut.handle(httpRequest);
      expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')));
    });

    test('Should call emailValidator with correct email', async () => {
      const { sut, emailValidatorStub } = makeSut();
      const isValidEmailSpy = jest.spyOn(emailValidatorStub, 'isValid');
      await sut.handle(makeFakeRequest());
      expect(isValidEmailSpy).toHaveBeenCalledWith('email@email.com');
    });

    test('Should return 500 if emailValidator throws', async () => {
      const { sut, emailValidatorStub } = makeSut();
      jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
        throw new Error();
      });
      const httpResponse = await sut.handle(makeFakeRequest());
      expect(httpResponse).toEqual(serverError(new ServerError(null)));
    });
  });

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
      expect(httpResponse).toEqual(ok(makeFakeAccount()));
    });

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
