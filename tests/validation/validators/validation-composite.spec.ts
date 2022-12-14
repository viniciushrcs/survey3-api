import { ValidationComposite } from '../../../src/validation/validators';
import {
  InvalidParamError,
  MissingParamError
} from '../../../src/presentation/errors';
import { Validation } from '../../../src/presentation/protocols';

interface SutTypes {
  validationStubs: Validation[];
  sut: ValidationComposite;
}

const makeValidation = () => {
  class ValidationStub implements Validation {
    validate(input: any): Error {
      return null;
    }
  }
  return new ValidationStub();
};

const makeSut = (): SutTypes => {
  const validationStubs = [makeValidation(), makeValidation()];
  const sut = new ValidationComposite(validationStubs);
  return {
    sut,
    validationStubs
  };
};

describe('ValidationComposite ', () => {
  test('Should return an error if any validation fails ', () => {
    const { sut, validationStubs } = makeSut();
    jest
      .spyOn(validationStubs[0], 'validate')
      .mockReturnValueOnce(new MissingParamError('field'));
    const error = sut.validate({ field: 'any_value' });
    expect(error).toEqual(new MissingParamError('field'));
  });

  test('Should return the first error if more than one validation fails ', () => {
    const { sut, validationStubs } = makeSut();
    jest
      .spyOn(validationStubs[0], 'validate')
      .mockReturnValueOnce(new MissingParamError('field'));
    jest
      .spyOn(validationStubs[1], 'validate')
      .mockReturnValueOnce(new InvalidParamError('field'));

    const error = sut.validate({ field: 'any_value' });
    expect(error).toEqual(new MissingParamError('field'));
  });

  test('Should not return on success', () => {
    const { sut } = makeSut();
    const error = sut.validate({ field: 'any_value' });
    expect(error).toBeFalsy();
  });
});
