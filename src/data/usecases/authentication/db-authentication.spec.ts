import { DbAuthentication } from './db-authentication';
import {
  AccountModel,
  AuthenticationParams,
  HashComparer,
  LoadAccountByEmailRepository,
  TokenGenerator,
  UpdateAccessTokenRepository
} from './db-authentication-protocols';

interface SutTypes {
  loadAccountByEmailRepoStub: LoadAccountByEmailRepository;
  hashComparerStub: HashComparer;
  tokenGeneratorStub: TokenGenerator;
  updateAccessTokenRepositoryStub: UpdateAccessTokenRepository;
  sut: DbAuthentication;
}

const makeFakeAccount = (): AccountModel => ({
  id: 'any_id',
  name: 'name',
  email: 'email@email.com',
  password: 'wTzVTHQ6'
});

const makeFakeAuthInput = (): AuthenticationParams => ({
  email: 'email@email.com',
  password: 'password'
});

const makeLoadAccountByEmailRepoStub = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepoStub implements LoadAccountByEmailRepository {
    async loadAccountByEmail(email: string): Promise<AccountModel> {
      return Promise.resolve(makeFakeAccount());
    }
  }
  return new LoadAccountByEmailRepoStub();
};

const makeTokenGeneratorStub = (): TokenGenerator => {
  class TokenGeneratorStub implements TokenGenerator {
    async generate(id: string): Promise<string> {
      return Promise.resolve('any_token');
    }
  }
  return new TokenGeneratorStub();
};

const makeHashComparerStub = (): HashComparer => {
  class HashComparerStub implements HashComparer {
    async compare(value: string, hash: string): Promise<boolean> {
      return Promise.resolve(true);
    }
  }
  return new HashComparerStub();
};

const makeUpdateAccessTokenRepositoryStub = (): UpdateAccessTokenRepository => {
  class UpdateAccessTokenRepositoryStub implements UpdateAccessTokenRepository {
    async updateAccessToken(id: string, accessToken: string): Promise<void> {
      return Promise.resolve();
    }
  }
  return new UpdateAccessTokenRepositoryStub();
};

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepoStub = makeLoadAccountByEmailRepoStub();
  const hashComparerStub = makeHashComparerStub();
  const tokenGeneratorStub = makeTokenGeneratorStub();
  const updateAccessTokenRepositoryStub = makeUpdateAccessTokenRepositoryStub();
  const sut = new DbAuthentication(
    loadAccountByEmailRepoStub,
    hashComparerStub,
    tokenGeneratorStub,
    updateAccessTokenRepositoryStub
  );
  return {
    sut,
    loadAccountByEmailRepoStub,
    hashComparerStub,
    tokenGeneratorStub,
    updateAccessTokenRepositoryStub
  };
};

describe('DbAuthentication', () => {
  describe('LoadAccountByEmailRepository', () => {
    test(' Should call LoadAccountByEmailRepository with correct email', async () => {
      const { sut, loadAccountByEmailRepoStub } = makeSut();
      const loadAccountSpy = jest.spyOn(
        loadAccountByEmailRepoStub,
        'loadAccountByEmail'
      );
      await sut.authenticate(makeFakeAuthInput());
      expect(loadAccountSpy).toHaveBeenCalledWith('email@email.com');
    });

    test('Should throw if LoadAccountByEmailRepository throws', async () => {
      const { sut, loadAccountByEmailRepoStub } = makeSut();
      jest
        .spyOn(loadAccountByEmailRepoStub, 'loadAccountByEmail')
        .mockRejectedValueOnce(() => {
          throw new Error();
        });
      const promise = sut.authenticate(makeFakeAuthInput());
      await expect(promise).rejects.toThrow();
    });

    test(' Should return null if LoadAccountByEmailRepository returns null', async () => {
      const { sut, loadAccountByEmailRepoStub } = makeSut();
      jest
        .spyOn(loadAccountByEmailRepoStub, 'loadAccountByEmail')
        .mockReturnValueOnce(null);
      const accessToken = await sut.authenticate(makeFakeAuthInput());
      expect(accessToken).toBeNull();
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

    test(' Should return null if comparison fails', async () => {
      const { sut, hashComparerStub } = makeSut();
      jest.spyOn(hashComparerStub, 'compare').mockResolvedValueOnce(false);
      const accessToken = await sut.authenticate(makeFakeAuthInput());
      expect(accessToken).toBeNull();
    });
  });

  describe('TokenGenerator', () => {
    test(' Should call TokenGenerator with correct id', async () => {
      const { sut, tokenGeneratorStub } = makeSut();
      const generateSpy = jest.spyOn(tokenGeneratorStub, 'generate');
      await sut.authenticate(makeFakeAuthInput());
      expect(generateSpy).toHaveBeenCalledWith('any_id');
    });

    test('Should throw if TokenGenerator throws', async () => {
      const { sut, tokenGeneratorStub } = makeSut();
      jest.spyOn(tokenGeneratorStub, 'generate').mockRejectedValueOnce(() => {
        throw new Error();
      });
      const promise = sut.authenticate(makeFakeAuthInput());
      await expect(promise).rejects.toThrow();
    });

    test(' Should return a new accessToken on success', async () => {
      const { sut } = makeSut();
      const accessToken = await sut.authenticate(makeFakeAuthInput());
      expect(accessToken).toBe('any_token');
    });
  });

  describe('UpdateAccessTokenRepository', () => {
    test('Should call UpdateAccessTokenRepository with correct values', async () => {
      const { sut, updateAccessTokenRepositoryStub } = makeSut();
      const updateSpy = jest.spyOn(
        updateAccessTokenRepositoryStub,
        'updateAccessToken'
      );
      await sut.authenticate(makeFakeAuthInput());
      expect(updateSpy).toHaveBeenCalledWith('any_id', 'any_token');
    });

    test('Should throw if UpdateAccessTokenRepository throws', async () => {
      const { sut, updateAccessTokenRepositoryStub } = makeSut();
      jest
        .spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken')
        .mockRejectedValueOnce(() => {
          throw new Error();
        });
      const promise = sut.authenticate(makeFakeAuthInput());
      await expect(promise).rejects.toThrow();
    });
  });
});
