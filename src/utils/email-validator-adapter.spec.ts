import { EmailValidatorAdapter } from './email-validator-adapter';
import validator from 'validator';

jest.mock('validator', () => ({
  isEmail(): boolean {
    return true;
  }
}));

const makeSut = (): EmailValidatorAdapter => {
  return new EmailValidatorAdapter();
};

describe('EmailValidator Adapter', () => {
  test('Should return false if validator returns false', () => {
    const sut = makeSut();
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false);
    const isValid = sut.isValid('invalid-email');
    expect(isValid).toBe(false);
  });

  test('Should return true if validator returns true', () => {
    const sut = makeSut();
    const isValid = sut.isValid('email@email.com');
    expect(isValid).toBe(true);
  });

  test('Should call validator with correct value', () => {
    const sut = makeSut();
    const validatorSpy = jest
      .spyOn(validator, 'isEmail')
      .mockReturnValueOnce(false);
    sut.isValid('email@email.com');
    expect(validatorSpy).toHaveBeenCalledWith('email@email.com');
  });
});
