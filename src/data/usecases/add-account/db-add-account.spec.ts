import { DbAddAccount } from './db-add-account';
import { AddAccountModel } from '../../../domain/usecases/add-account';

describe('DbAddAccount UseCase', () => {
  test('Should call Encrypter with correct password', async () => {
    class EncrypterStub {
      async encrypt(value: string): Promise<string> {
        return new Promise((resolve) => resolve('hashed_password'));
      }
    }
    const encrypterStub = new EncrypterStub();
    const addAccount: AddAccountModel = {
      name: 'name',
      email: 'email@email.com',
      password: 'password'
    };
    const sut = new DbAddAccount(encrypterStub);
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt');
    await sut.add(addAccount);
    expect(encryptSpy).toHaveBeenCalledWith('password');
  });
});
