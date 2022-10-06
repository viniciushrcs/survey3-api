import { DbAddAccount } from './db-add-account';
import {
  AccountModel,
  AddAccountModel,
  AddAccountRepository,
  Encrypter
} from './db-add-account-protocols';

interface SutTypes {
  sut: DbAddAccount;
  encrypterStub: Encrypter;
  addAccountRepositoryStub: AddAccountRepository;
}

const makeFakeAccount = (): AccountModel => ({
  id: 'dcaddfa4-5cc4-4442-ae9e-011fbc64971f',
  name: 'name',
  email: 'email',
  password: 'hashed_password'
});

const makeAddAccount = (): AddAccountModel => ({
  name: 'name',
  email: 'email@email.com',
  password: 'password'
});

const makeAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add(accountData: AddAccountModel): Promise<AccountModel> {
      return new Promise((resolve) => resolve(makeFakeAccount()));
    }
  }
  return new AddAccountRepositoryStub();
};

const makeEncrypterStub = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt(value: string): Promise<string> {
      return new Promise((resolve) => resolve('hashed_password'));
    }
  }
  return new EncrypterStub();
};

const makeSut = (): SutTypes => {
  const encrypterStub = makeEncrypterStub();
  const addAccountRepositoryStub = makeAddAccountRepository();
  const sut = new DbAddAccount(encrypterStub, addAccountRepositoryStub);
  return {
    sut,
    encrypterStub,
    addAccountRepositoryStub
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
});
