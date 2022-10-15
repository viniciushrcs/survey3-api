import {
  RequiredFieldValidation,
  ValidationComposite
} from '../../../../src/validation/validators';
import { Validation } from '../../../../src/presentation/protocols';
import { makeAddSurveyValidation } from '../../../../src/main/factories/controllers/survey/add-survey-validation';

jest.mock('../../../../src/validation/validators/validation-composite');

describe('Survey Validation Factory', () => {
  test('Should call ValidationComposite with all validations ', () => {
    makeAddSurveyValidation();
    const validations: Validation[] = [];
    for (const field of ['question', 'answers']) {
      validations.push(new RequiredFieldValidation(field));
    }
    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
