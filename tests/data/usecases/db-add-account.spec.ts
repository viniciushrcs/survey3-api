import { DbAddAccount } from '../../../src/data/usecases/add-account/db-add-account';
import {
  AccountModel,
  AddAccountParams,
  AddAccountRepository,
  CheckAccountByEmailRepository,
  Encrypter
} from '../../../src/data/usecases/add-account/db-add-account-protocols';

interface SutTypes {
  sut: DbAddAccount;
  encrypterStub: Encrypter;
  addAccountRepositoryStub: AddAccountRepository;
  checkAccountByEmailRepoStub: CheckAccountByEmailRepository;
}

const makeFakeAccount = (): AccountModel => ({
  id: 'dcaddfa4-5cc4-4442-ae9e-011fbc64971f',
  name: 'name',
  email: 'email',
  password: 'hashed_password'
});

const makeAddAccount = (): AddAccountParams => ({
  name: 'name',
  email: 'email@email.com',
  password: 'password'
});

const makeAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add(accountData: AddAccountParams): Promise<AccountModel> {
      return Promise.resolve(makeFakeAccount());
    }
  }
  return new AddAccountRepositoryStub();
};

const makeCheckAccountByEmailRepositoryStub =
  (): CheckAccountByEmailRepository => {
    class CheckAccountByEmailRepoStub implements CheckAccountByEmailRepository {
      async checkByEmail(email: string): Promise<boolean> {
        return Promise.resolve(false);
      }
    }
    return new CheckAccountByEmailRepoStub();
  };

const makeEncrypterStub = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt(value: string): Promise<string> {
      return Promise.resolve('hashed_password');
    }
  }
  return new EncrypterStub();
};

const makeSut = (): SutTypes => {
  const encrypterStub = makeEncrypterStub();
  const addAccountRepositoryStub = makeAddAccountRepository();
  const checkAccountByEmailRepoStub = makeCheckAccountByEmailRepositoryStub();
  const sut = new DbAddAccount(
    encrypterStub,
    addAccountRepositoryStub,
    checkAccountByEmailRepoStub
  );
  return {
    sut,
    encrypterStub,
    addAccountRepositoryStub,
    checkAccountByEmailRepoStub
  };
};

describe('DbAddAccount UseCase', () => {
  describe('Encrypter', () => {
    test('Should call Encrypter with correct password', async () => {
      const { sut, encrypterStub } = makeSut();
      const encryptSpy = jest.spyOn(encrypterStub, 'encrypt');
      await sut.add(makeAddAccount());
      expect(encryptSpy).toHaveBeenCalledWith('password');
    });

    test('Should throw if Encrypter throws', async () => {
      const { sut, encrypterStub } = makeSut();
      jest.spyOn(encrypterStub, 'encrypt').mockRejectedValueOnce(() => {
        throw new Error();
      });
      const promise = sut.add(makeAddAccount());
      await expect(promise).rejects.toThrow();
    });
  });

  describe('AddAccountRepository', () => {
    test('Should call AddAccountRepository with correct values', async () => {
      const { sut, addAccountRepositoryStub } = makeSut();
      const addSpy = jest.spyOn(addAccountRepositoryStub, 'add');
      await sut.add(makeAddAccount());
      expect(addSpy).toHaveBeenCalledWith({
        name: 'name',
        email: 'email@email.com',
        password: 'hashed_password'
      });
    });

    test('Should throw if AddAccountRepository throws', async () => {
      const { sut, addAccountRepositoryStub } = makeSut();
      jest.spyOn(addAccountRepositoryStub, 'add').mockRejectedValueOnce(() => {
        throw new Error();
      });
      const promise = sut.add(makeAddAccount());
      await expect(promise).rejects.toThrow();
    });

    test('Should return an account on success', async () => {
      const { sut } = makeSut();
      const account = await sut.add(makeAddAccount());
      expect(account).toEqual(makeFakeAccount());
    });
  });

  describe('CheckAccountByEmailRepository', () => {
    test(' Should call CheckAccountByEmailRepository with correct email', async () => {
      const { sut, checkAccountByEmailRepoStub } = makeSut();
      const loadAccountSpy = jest.spyOn(
        checkAccountByEmailRepoStub,
        'checkByEmail'
      );
      await sut.add(makeAddAccount());
      expect(loadAccountSpy).toHaveBeenCalledWith('email@email.com');
    });

    test('Should throw if CheckAccountByEmailRepository throws', async () => {
      const { sut, checkAccountByEmailRepoStub } = makeSut();
      jest
        .spyOn(checkAccountByEmailRepoStub, 'checkByEmail')
        .mockRejectedValueOnce(() => {
          throw new Error();
        });
      const promise = sut.add(makeAddAccount());
      await expect(promise).rejects.toThrow();
    });

    test(' Should return null if CheckAccountByEmailRepository returns an account', async () => {
      const { sut, checkAccountByEmailRepoStub } = makeSut();
      jest
        .spyOn(checkAccountByEmailRepoStub, 'checkByEmail')
        .mockResolvedValueOnce(true);
      const accessToken = await sut.add(makeAddAccount());
      expect(accessToken).toBeNull();
    });
  });
});
