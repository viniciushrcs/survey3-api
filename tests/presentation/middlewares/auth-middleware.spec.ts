import {
  forbidden,
  ok,
  serverError
} from '../../../src/presentation/helpers/http/http-helper';
import { AccessDeniedError } from '../../../src/presentation/errors';
import { AuthMiddleware } from '../../../src/presentation/middlewares/auth-middleware';
import {
  AccountModel,
  HttpRequest,
  LoadAccountByToken
} from '../../../src/presentation/middlewares/auth-middleware-protocols';

interface SutTypes {
  sut: AuthMiddleware;
  loadAccountByTokenStub: LoadAccountByToken;
}

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'name',
  email: 'email',
  password: 'hashed_password'
});

const makeFakeRequest = (): HttpRequest => ({
  headers: {
    'x-access-token': 'any_token'
  }
});

const makeLoadAccountByTokenStub = () => {
  class LoadAccountByTokenStub implements LoadAccountByToken {
    async loadAccount(accessToken: string): Promise<AccountModel> {
      return Promise.resolve(makeFakeAccount());
    }
  }
  return new LoadAccountByTokenStub();
};

const makeSut = (role?: string): SutTypes => {
  const loadAccountByTokenStub = makeLoadAccountByTokenStub();
  const sut = new AuthMiddleware(loadAccountByTokenStub, role);
  return {
    sut,
    loadAccountByTokenStub
  };
};

describe('Auth Middleware', () => {
  test('Should return 403 if no x-access-token exists in headers', async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle({});
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()));
  });

  describe('LoadAccountByToken', () => {
    test('Should call LoadAccountByToken with correct accessToken and role', async () => {
      const role = 'any_role';
      const { sut, loadAccountByTokenStub } = makeSut(role);
      const loadAccountSpy = jest.spyOn(loadAccountByTokenStub, 'loadAccount');
      await sut.handle(makeFakeRequest());
      expect(loadAccountSpy).toHaveBeenCalledWith('any_token', role);
    });

    test('Should return 403 if LoadAccountByToken returns null', async () => {
      const { sut, loadAccountByTokenStub } = makeSut();
      jest
        .spyOn(loadAccountByTokenStub, 'loadAccount')
        .mockResolvedValueOnce(null);
      const httpResponse = await sut.handle(makeFakeRequest());
      expect(httpResponse).toEqual(forbidden(new AccessDeniedError()));
    });

    test('Should return 500 if LoadAccountByToken throws', async () => {
      const { sut, loadAccountByTokenStub } = makeSut();
      jest
        .spyOn(loadAccountByTokenStub, 'loadAccount')
        .mockRejectedValueOnce(new Error());
      const httpResponse = await sut.handle(makeFakeRequest());
      expect(httpResponse).toEqual(serverError(new Error()));
    });

    test('Should return 200 if LoadAccountByToken returns an account', async () => {
      const { sut } = makeSut();
      const httpResponse = await sut.handle(makeFakeRequest());
      expect(httpResponse).toEqual(ok({ userId: 'valid_id' }));
    });
  });
});
