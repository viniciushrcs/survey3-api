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

const makeAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add(accountData: AddAccountModel): Promise<AccountModel> {
      const newAccount = {
        id: 'dcaddfa4-5cc4-4442-ae9e-011fbc64971f',
        name: accountData.name,
        email: accountData.email,
        password: 'hashed_password'
      };
      return new Promise((resolve) => resolve(newAccount));
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
      const addAccount: AddAccountModel = {
        name: 'name',
        email: 'email@email.com',
        password: 'password'
      };
      const { sut, encrypterStub } = makeSut();
      const encryptSpy = jest.spyOn(encrypterStub, 'encrypt');
      await sut.add(addAccount);
      expect(encryptSpy).toHaveBeenCalledWith('password');
    });

    test('Should throw if Encrypter throws', async () => {
      // aqui não devemos tratar o erro com um try/catch, pois isso é responsabilidade
      // da camada de Presentation

      // A camada de Presentation é quem retorna os erros e repassa ao cliente
      // Informando o que aconteceu

      const addAccount: AddAccountModel = {
        name: 'name',
        email: 'email@email.com',
        password: 'password'
      };
      const { sut, encrypterStub } = makeSut();
      jest.spyOn(encrypterStub, 'encrypt').mockRejectedValueOnce(() => {
        throw new Error();
      });
      const promise = sut.add(addAccount);
      await expect(promise).rejects.toThrow();
    });
  });

  describe('AddAccountRepository', () => {
    test('Should call AddAccountRepository with correct values', async () => {
      const addAccount: AddAccountModel = {
        name: 'name',
        email: 'email@email.com',
        password: 'password'
      };
      const { sut, addAccountRepositoryStub } = makeSut();
      const addSpy = jest.spyOn(addAccountRepositoryStub, 'add');
      await sut.add(addAccount);
      expect(addSpy).toHaveBeenCalledWith({
        name: 'name',
        email: 'email@email.com',
        password: 'hashed_password'
      });
    });
  });
});
