import { DbAuthentication } from './db-authentication';
import {
  AccountModel,
  AuthenticationModel,
  LoadAccountByEmailRepository
} from './db-authentication-protocols';

interface SutTypes {
  loadAccountByEmailRepoStub: LoadAccountByEmailRepository;
  sut: DbAuthentication;
}

const makeFakeAccount = (): AccountModel => ({
  id: 'c53cd3f2-df40-497a-8061-56d9f8d4df01',
  name: 'name',
  email: 'email@email.com',
  password: 'wTzVTHQ6'
});

const makeFakeAuthInput = (): AuthenticationModel => ({
  email: 'email@email.com',
  password: 'password'
});

const makeLoadAccountByEmailRepoStub = () => {
  class LoadAccountByEmailRepoStub implements LoadAccountByEmailRepository {
    async loadAccount(email: string): Promise<AccountModel> {
      return new Promise((resolve) => resolve(makeFakeAccount()));
    }
  }
  return new LoadAccountByEmailRepoStub();
};

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepoStub = makeLoadAccountByEmailRepoStub();
  const sut = new DbAuthentication(loadAccountByEmailRepoStub);
  return {
    sut,
    loadAccountByEmailRepoStub
  };
};

describe('DbAuthentication', () => {
  describe('LoadAccountByEmailRepository', () => {
    test(' Should call LoadAccountByEmailRepository with correct email', async () => {
      const { sut, loadAccountByEmailRepoStub } = makeSut();
      const loadAccountSpy = jest.spyOn(
        loadAccountByEmailRepoStub,
        'loadAccount'
      );
      await sut.authenticate(makeFakeAuthInput());
      expect(loadAccountSpy).toHaveBeenCalledWith('email@email.com');
    });

    test('Should throw if LoadAccountByEmailRepository throws', async () => {
      const { sut, loadAccountByEmailRepoStub } = makeSut();
      jest
        .spyOn(loadAccountByEmailRepoStub, 'loadAccount')
        .mockRejectedValueOnce(() => {
          throw new Error();
        });
      const promise = sut.authenticate(makeFakeAuthInput());
      await expect(promise).rejects.toThrow();
    });
  });
});
