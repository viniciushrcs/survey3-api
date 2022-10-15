import { RequiredFieldValidation } from '../../../src/validation/validators';
import { MissingParamError } from '../../../src/presentation/errors';

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
