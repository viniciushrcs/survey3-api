import { BcryptAdapter } from './bcrypt-adapter';
import bcrypt from 'bcrypt';

const salt = 12;
const makeSut = (): BcryptAdapter => {
  return new BcryptAdapter(salt);
};
jest.mock('bcrypt', () => ({
  async hash(): Promise<string> {
    return 'hashed';
  },

  async compare(): Promise<boolean> {
    return true;
  }
}));

describe('BCryptAdapter', () => {
  describe('Hash', () => {
    test('Should call hash with correct values', async () => {
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

    test('Should throw if hash throws', async () => {
      const sut = makeSut();
      jest.spyOn(bcrypt, 'hash').mockImplementationOnce(() => {
        throw new Error();
      });
      const promise = sut.encrypt('value');
      await expect(promise).rejects.toThrow();
    });
  });

  describe('Compare', () => {
    test('Should call compare with correct values', async () => {
      const sut = makeSut();
      const hashSpy = jest.spyOn(bcrypt, 'compare');
      await sut.compare('any_value', 'any_hash');
      expect(hashSpy).toHaveBeenCalledWith('any_value', 'any_hash');
    });

    test('Should throw if compare throws', async () => {
      const sut = makeSut();
      jest.spyOn(bcrypt, 'compare').mockImplementationOnce(() => {
        throw new Error();
      });
      const promise = sut.compare('any_value', 'any_hash');
      await expect(promise).rejects.toThrow();
    });

    test('Should return true on success', async () => {
      const sut = makeSut();
      const encryptedPassword = await sut.compare('any_value', 'any_hash');
      expect(encryptedPassword).toBe(true);
    });
  });
});
