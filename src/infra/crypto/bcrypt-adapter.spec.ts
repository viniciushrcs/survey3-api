import { BcryptAdapter } from './bcrypt-adapter';
import bcrypt from 'bcrypt';

const salt = 12;
const makeSut = (): BcryptAdapter => {
  return new BcryptAdapter(salt);
};
jest.mock('bcrypt', () => ({
  async hash(): Promise<string> {
    return 'hashed';
  }
}));

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

  test('Should throw if bcrypt throws', async () => {
    const sut = makeSut();
    jest.spyOn(bcrypt, 'hash').mockImplementationOnce(() => {
      throw new Error();
    });
    const promise = sut.encrypt('value');
    await expect(promise).rejects.toThrow();
  });
});
