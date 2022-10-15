import { DbLoadAccountByToken } from '../../../src/data/usecases/load-account-by-token/db-load-account-by-token';
import {
  AccountModel,
  LoadAccountByTokenRepository,
  TokenVerifier
} from '../../../src/data/usecases/load-account-by-token/db-load-account-by-token-protocols';

interface SutTypes {
  sut: DbLoadAccountByToken;
  decrypterStub: TokenVerifier;
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
      return Promise.resolve(makeFakeAccount());
    }
  }
  return new LoadAccountByTokenRepositoryStub();
};

const maketokenVerifierStub = () => {
  class tokenVerifierStub implements TokenVerifier {
    async verify(value: string): Promise<string> {
      return Promise.resolve('any_value');
    }
  }
  return new tokenVerifierStub();
};

const makeSut = (): SutTypes => {
  const decrypterStub = maketokenVerifierStub();
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
  describe('tokenVerifier', () => {
    test('Should call tokenVerifier with correct values', async () => {
      const { sut, decrypterStub } = makeSut();
      const decryptSpy = jest.spyOn(decrypterStub, 'verify');
      await sut.loadAccount('any_token', 'any_role');
      expect(decryptSpy).toHaveBeenCalledWith('any_token');
    });

    test('Should return null if tokenVerifier returns null', async () => {
      const { sut, decrypterStub } = makeSut();
      jest.spyOn(decrypterStub, 'verify').mockResolvedValueOnce(null);
      const account = await sut.loadAccount('any_token', 'any_role');
      expect(account).toBeNull();
    });

    test('Should return null if tokenVerifier throws', async () => {
      const { sut, decrypterStub } = makeSut();
      jest.spyOn(decrypterStub, 'verify').mockRejectedValueOnce(() => {
        throw new Error();
      });
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

    test('Should return an account on LoadAccountByTokenRepository success', async () => {
      const { sut } = makeSut();
      const account = await sut.loadAccount('any_token', 'any_role');
      expect(account).toEqual(makeFakeAccount());
    });

    test('Should throws if LoadAccountByTokenRepository throws', async () => {
      const { sut, loadAccountByTokenRepositorStub } = makeSut();
      jest
        .spyOn(loadAccountByTokenRepositorStub, 'loadAccountByToken')
        .mockRejectedValueOnce(() => {
          throw new Error();
        });
      const promise = sut.loadAccount('any_token', 'any_role');
      await expect(promise).rejects.toThrow();
    });
  });
});
