import { JwtAdapter } from './jwt-adapter';
import jwt from 'jsonwebtoken';

const SECRET = 'secret';
const makeSut = (): JwtAdapter => {
  return new JwtAdapter(SECRET);
};
jest.mock('jsonwebtoken', () => ({
  sign(): string {
    return 'webtoken';
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

    test('Should throw if hash throws', async () => {
      const sut = makeSut();
      jest.spyOn(jwt, 'sign').mockImplementationOnce(() => {
        throw new Error();
      });
      const promise = sut.generate('value');
      await expect(promise).rejects.toThrow();
    });

    test('Should return a new token on success', async () => {
      const sut = makeSut();
      const authToken = await sut.generate('any_id');
      expect(authToken).toBe('webtoken');
    });
  });
});
