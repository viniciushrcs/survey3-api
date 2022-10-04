import { BcryptAdapter } from './bcrypt-adapter';
import bcrypt from 'bcrypt';

jest.mock('bcrypt', () => ({
  async hash(): Promise<string> {
    return new Promise((resolve) => resolve('hashed'));
  }
}));

const salt = 12;
const makeSut = (): BcryptAdapter => {
  return new BcryptAdapter(salt);
};

describe('BCryptAdapter', () => {
  test('Should call bcrypt with correct values', async () => {
    const sut = makeSut();
    const hashSpy = jest.spyOn(bcrypt, 'hash');
    await sut.encrypt('value');
    expect(hashSpy).toHaveBeenCalledWith('value', salt);
  });

  test('Should return the encrypted data', async () => {
    const sut = makeSut();
    const encryptedPassword = await sut.encrypt('value');
    expect(encryptedPassword).toBe('hashed');
  });
});
