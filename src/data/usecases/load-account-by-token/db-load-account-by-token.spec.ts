import { DbLoadAccountByToken } from './db-load-account-by-token';
import { Decrypter } from './db-load-account-by-token-protocols';

interface SutTypes {
  sut: DbLoadAccountByToken;
  decrypterStub: Decrypter;
}

const makeDecrypterStub = () => {
  class DecrypterStub implements Decrypter {
    async decrypt(value: string): Promise<string> {
      return new Promise((resolve) => resolve('any_value'));
    }
  }
  return new DecrypterStub();
};

const makeSut = (): SutTypes => {
  const decrypterStub = makeDecrypterStub();
  const sut = new DbLoadAccountByToken(decrypterStub);
  return {
    sut,
    decrypterStub
  };
};

describe('DbLoadAccountByToken UseCase', () => {
  describe('Decrypter', () => {
    test('Should call Decrypter with correct values', async () => {
      const { sut, decrypterStub } = makeSut();
      const decryptSpy = jest.spyOn(decrypterStub, 'decrypt');
      await sut.loadAccount('any_token', 'any_role');
      expect(decryptSpy).toHaveBeenCalledWith('any_token');
    });

    test('Should return null if Decrypter returns null', async () => {
      const { sut, decrypterStub } = makeSut();
      jest.spyOn(decrypterStub, 'decrypt').mockResolvedValueOnce(null);
      const account = await sut.loadAccount('any_token', 'any_role');
      expect(account).toBeNull();
    });
  });
});
