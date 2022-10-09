import { forbidden } from '../helpers/http/http-helper';
import { AccessDeniedError } from '../errors';
import { AuthMiddleware } from './auth-middleware';
import { AccountModel } from '../../domain/models/account';
import { HttpRequest } from '../protocols';
import { LoadAccountByToken } from '../../domain/usecases/load-account-by-token';

interface SutTypes {
  sut: AuthMiddleware;
  loadAccountByTokenStub: LoadAccountByToken;
}

const makeFakeAccount = (): AccountModel => ({
  id: 'dcaddfa4-5cc4-4442-ae9e-011fbc64971f',
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
      return new Promise((resolve) => resolve(makeFakeAccount()));
    }
  }
  return new LoadAccountByTokenStub();
};

const makeSut = (): SutTypes => {
  const loadAccountByTokenStub = makeLoadAccountByTokenStub();
  const sut = new AuthMiddleware(loadAccountByTokenStub);
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

  test('Should call LoadAccountByToken with correct accessToken', async () => {
    const { sut, loadAccountByTokenStub } = makeSut();
    const loadAccountSpy = jest.spyOn(loadAccountByTokenStub, 'loadAccount');
    await sut.handle(makeFakeRequest());
    expect(loadAccountSpy).toHaveBeenCalledWith('any_token');
  });
});
