import { DbAddAccount } from './db-add-account';
import { AddAccountModel } from '../../../domain/usecases/add-account';
import { Encrypter } from '../../protocols/encrypter';

interface SutTypes {
  sut: DbAddAccount;
  encrypterStub: Encrypter;
}

const makeEncrypterStub = (): Encrypter => {
  class EncrypterStub {
    async encrypt(value: string): Promise<string> {
      return new Promise((resolve) => resolve('hashed_password'));
    }
  }
  return new EncrypterStub();
};

const makeSut = (): SutTypes => {
  const encrypterStub = makeEncrypterStub();
  const sut = new DbAddAccount(encrypterStub);
  return {
    sut,
    encrypterStub
  };
};

describe('DbAddAccount UseCase', () => {
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
