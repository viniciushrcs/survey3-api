import { DbAuthentication } from './db-authentication';
import { LoadAccountByEmailRepository } from '../../../protocols/load-account-by-email-repository.ts';
import { AccountModel } from '../../../../domain/models/account';

describe('DbAuthentication', () => {
  interface SutTypes {
    loadAccountByEmailRepoStub: LoadAccountByEmailRepository;
    sut: DbAuthentication;
  }

  const makeLoadAccountByEmailRepoStub = () => {
    class LoadAccountByEmailRepoStub implements LoadAccountByEmailRepository {
      async loadAccount(email: string): Promise<AccountModel> {
        const account: AccountModel = {
          id: 'c53cd3f2-df40-497a-8061-56d9f8d4df01',
          name: 'name',
          email: 'email@email.com',
          password: 'wTzVTHQ6'
        };
        return new Promise((resolve) => resolve(account));
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

  describe('LoadAccountByEmailRepository', () => {
    test(' Should call LoadAccountByEmailRepository with correct email', async () => {
      const { sut, loadAccountByEmailRepoStub } = makeSut();
      const loadAccountSpy = jest.spyOn(
        loadAccountByEmailRepoStub,
        'loadAccount'
      );
      await sut.authenticate({
        email: 'email@email.com',
        password: 'password'
      });
      expect(loadAccountSpy).toHaveBeenCalledWith('email@email.com');
    });
  });
});
