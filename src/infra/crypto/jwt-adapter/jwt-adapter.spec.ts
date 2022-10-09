import { JwtAdapter } from './jwt-adapter';
import jwt from 'jsonwebtoken';

const SECRET = 'secret';
const makeSut = (): JwtAdapter => {
  return new JwtAdapter(SECRET);
};
jest.mock('jsonwebtoken', () => ({
  sign(): string {
    return 'webtoken';
  },
  verify(): string {
    return 'any_value';
  }
}));

describe('JwtAdapter', () => {
  describe('Sign', () => {
    test('Should call sign with correct values', async () => {
      const sut = makeSut();
      const signSpy = jest.spyOn(jwt, 'sign');
      await sut.generate('any_id');
      expect(signSpy).toHaveBeenCalledWith({ id: 'any_id' }, SECRET);
    });

    test('Should throw if sign throws', async () => {
      const sut = makeSut();
      jest.spyOn(jwt, 'sign').mockImplementationOnce(() => {
        throw new Error();
      });
      const promise = sut.generate('value');
      await expect(promise).rejects.toThrow();
    });

    test('Should return a new token on success', async () => {
      const sut = makeSut();
      const accessToken = await sut.generate('any_id');
      expect(accessToken).toBe('webtoken');
    });
  });

  describe('Verify', () => {
    test('Should call verify with correct values', async () => {
      const sut = makeSut();
      const signSpy = jest.spyOn(jwt, 'verify');
      await sut.verify('any_token');
      expect(signSpy).toHaveBeenCalledWith('any_token', SECRET);
    });

    test('Should throw if verify throws', async () => {
      const sut = makeSut();
      jest.spyOn(jwt, 'verify').mockImplementationOnce(() => {
        throw new Error();
      });
      const promise = sut.verify('value');
      await expect(promise).rejects.toThrow();
    });

    test('Should return a value on success', async () => {
      const sut = makeSut();
      const value = await sut.verify('any_token');
      expect(value).toBe('any_value');
    });
  });
});
