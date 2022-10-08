import { InvalidParamError } from '../../errors';
import { CompareFieldsValidation } from './compare-fields-validation';

describe('CompareField Validation', () => {
  const makeSut = () => {
    return new CompareFieldsValidation('field', 'fieldToCompare');
  };
  test('Should return an InvalidParamError if validation fails', () => {
    const sut = makeSut();
    const error = sut.validate({
      field: 'name',
      fieldToCompare: 'invalid_value'
    });
    expect(error).toEqual(new InvalidParamError('fieldToCompare'));
  });

  test('Should not return if validation succeeds', () => {
    const sut = makeSut();
    const error = sut.validate({ field: 'name', fieldToCompare: 'name' });
    expect(error).toBeFalsy();
  });
});
