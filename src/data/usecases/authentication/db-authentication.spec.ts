import { DbAuthentication } from './db-authentication';
import {
  AccountModel,
  AuthenticationModel,
  HashComparer,
  LoadAccountByEmailRepository
} from './db-authentication-protocols';

interface SutTypes {
  loadAccountByEmailRepoStub: LoadAccountByEmailRepository;
  hashComparerStub: HashComparer;
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

const makeHashComparerStub = () => {
  class HashComparerStub implements HashComparer {
    async compare(value: string, hash: string): Promise<boolean> {
      return new Promise((resolve) => resolve(true));
    }
  }
  return new HashComparerStub();
};

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepoStub = makeLoadAccountByEmailRepoStub();
  const hashComparerStub = makeHashComparerStub();
  const sut = new DbAuthentication(
    loadAccountByEmailRepoStub,
    hashComparerStub
  );
  return {
    sut,
    loadAccountByEmailRepoStub,
    hashComparerStub
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

    test(' Should return null if LoadAccountByEmailRepository returns null', async () => {
      const { sut, loadAccountByEmailRepoStub } = makeSut();
      jest
        .spyOn(loadAccountByEmailRepoStub, 'loadAccount')
        .mockReturnValueOnce(null);
      const authToken = await sut.authenticate(makeFakeAuthInput());
      expect(authToken).toBeNull();
    });
  });

  describe('HashComparer', () => {
    test(' Should call HashComparer with correct password', async () => {
      const { sut, hashComparerStub } = makeSut();
      const compareSpy = jest.spyOn(hashComparerStub, 'compare');
      await sut.authenticate(makeFakeAuthInput());
      expect(compareSpy).toHaveBeenCalledWith('password', 'wTzVTHQ6');
    });

    test('Should throw if HashComparer throws', async () => {
      const { sut, hashComparerStub } = makeSut();
      jest.spyOn(hashComparerStub, 'compare').mockRejectedValueOnce(() => {
        throw new Error();
      });
      const promise = sut.authenticate(makeFakeAuthInput());
      await expect(promise).rejects.toThrow();
    });
  });
});
