import { DbAddAccount } from '../../../src/data/usecases/add-account/db-add-account';
import {
  AccountModel,
  AddAccountParams,
  AddAccountRepository,
  Encrypter,
  LoadAccountByEmailRepository
} from '../../../src/data/usecases/add-account/db-add-account-protocols';

interface SutTypes {
  sut: DbAddAccount;
  encrypterStub: Encrypter;
  addAccountRepositoryStub: AddAccountRepository;
  loadAccountByEmailRepoStub: LoadAccountByEmailRepository;
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

const makeLoadAccountByEmailRepoStub = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepoStub implements LoadAccountByEmailRepository {
    async loadAccountByEmail(email: string): Promise<AccountModel> {
      return Promise.resolve(null);
    }
  }
  return new LoadAccountByEmailRepoStub();
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
  const loadAccountByEmailRepoStub = makeLoadAccountByEmailRepoStub();
  const sut = new DbAddAccount(
    encrypterStub,
    addAccountRepositoryStub,
    loadAccountByEmailRepoStub
  );
  return {
    sut,
    encrypterStub,
    addAccountRepositoryStub,
    loadAccountByEmailRepoStub
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
      // aqui não devemos tratar o erro com um try/catch, pois isso é responsabilidade
      // da camada de Presentation

      // A camada de Presentation é quem retorna os erros e repassa ao cliente
      // Informando o que aconteceu
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
      // aqui não devemos tratar o erro com um try/catch, pois isso é responsabilidade
      // da camada de Presentation

      // A camada de Presentation é quem retorna os erros e repassa ao cliente
      // Informando o que aconteceu
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

  describe('LoadAccountByEmailRepository', () => {
    test(' Should call LoadAccountByEmailRepository with correct email', async () => {
      const { sut, loadAccountByEmailRepoStub } = makeSut();
      const loadAccountSpy = jest.spyOn(
        loadAccountByEmailRepoStub,
        'loadAccountByEmail'
      );
      await sut.add(makeAddAccount());
      expect(loadAccountSpy).toHaveBeenCalledWith('email@email.com');
    });

    test('Should throw if LoadAccountByEmailRepository throws', async () => {
      const { sut, loadAccountByEmailRepoStub } = makeSut();
      jest
        .spyOn(loadAccountByEmailRepoStub, 'loadAccountByEmail')
        .mockRejectedValueOnce(() => {
          throw new Error();
        });
      const promise = sut.add(makeAddAccount());
      await expect(promise).rejects.toThrow();
    });

    test(' Should return null if LoadAccountByEmailRepository returns an account', async () => {
      const { sut, loadAccountByEmailRepoStub } = makeSut();
      jest
        .spyOn(loadAccountByEmailRepoStub, 'loadAccountByEmail')
        .mockResolvedValueOnce(makeFakeAccount());
      const accessToken = await sut.add(makeAddAccount());
      expect(accessToken).toBeNull();
    });
  });
});
