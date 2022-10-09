import { DbLoadAccountByToken } from './db-load-account-by-token';
import {
  AccountModel,
  Decrypter,
  LoadAccountByTokenRepository
} from './db-load-account-by-token-protocols';

interface SutTypes {
  sut: DbLoadAccountByToken;
  decrypterStub: Decrypter;
  loadAccountByTokenRepositorStub: LoadAccountByTokenRepository;
}

const makeFakeAccount = (): AccountModel => ({
  id: 'any_id',
  name: 'name',
  email: 'email',
  password: 'hashed_password'
});

const makeLoadAccountByTokenRepository = (): LoadAccountByTokenRepository => {
  class LoadAccountByTokenRepositoryStub
    implements LoadAccountByTokenRepository
  {
    async loadAccountByToken(
      token: string,
      role?: string
    ): Promise<AccountModel> {
      return new Promise((resolve) => resolve(makeFakeAccount()));
    }
  }
  return new LoadAccountByTokenRepositoryStub();
};

const makeDecrypterStub = () => {
  class DecrypterStub implements Decrypter {
    async decrypt(value: string): Promise<string> {
      return new Promise((resolve) => resolve('any_value'));
    }
  }
  return new DecrypterStub();
};

const makeSut = (): SutTypes => {
  const decrypterStub = makeDecrypterStub();
  const loadAccountByTokenRepositorStub = makeLoadAccountByTokenRepository();
  const sut = new DbLoadAccountByToken(
    decrypterStub,
    loadAccountByTokenRepositorStub
  );
  return {
    sut,
    decrypterStub,
    loadAccountByTokenRepositorStub
  };
};

describe('DbLoadAccountByToken UseCase', () => {
  describe('Decrypter', () => {
    test('Should call Decrypter with correct values', async () => {
      const { sut, decrypterStub } = makeSut();
      const decryptSpy = jest.spyOn(decrypterStub, 'decrypt');
      await sut.loadAccount('any_token', 'any_role');
      expect(decryptSpy).toHaveBeenCalledWith('any_token');
    });

    test('Should return null if Decrypter returns null', async () => {
      const { sut, decrypterStub } = makeSut();
      jest.spyOn(decrypterStub, 'decrypt').mockResolvedValueOnce(null);
      const account = await sut.loadAccount('any_token', 'any_role');
      expect(account).toBeNull();
    });
  });

  describe('LoadAccountByTokenRepository', () => {
    test('Should call LoadAccountByTokenRepository with correct values', async () => {
      const { sut, loadAccountByTokenRepositorStub } = makeSut();
      const decryptSpy = jest.spyOn(
        loadAccountByTokenRepositorStub,
        'loadAccountByToken'
      );
      await sut.loadAccount('any_token', 'any_role');
      expect(decryptSpy).toHaveBeenCalledWith('any_token', 'any_role');
    });
  });
});
