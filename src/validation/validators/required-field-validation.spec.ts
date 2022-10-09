import { RequiredFieldValidation } from './required-field-validation';
import { MissingParamError } from '../../presentation/errors';

describe('RequiredField Validation', () => {
  const makeSut = () => {
    return new RequiredFieldValidation('field');
  };
  test('Should return a MissingParamError if validation fails', () => {
    const sut = makeSut();
    const error = sut.validate({ name: 'name' });
    expect(error).toEqual(new MissingParamError('field'));
  });

  test('Should not return if validation succeeds', () => {
    const sut = makeSut();
    const error = sut.validate({ field: 'name' });
    expect(error).toBeFalsy();
  });
});
