import { Controller } from '../../../../presentation/protocols';
import { makeLogErrorDecorator } from '../../decorators/log-error';
import { AddSurveyController } from '../../../../presentation/controllers/survey/add-survey/add-survey-controller';
import { makeDbAddSurvey } from '../../usecases/db-add-survey';
import { makeAddSurveyValidation } from './add-survey-validation';

export const makeAddSurveyController = (): Controller => {
  return makeLogErrorDecorator(
    new AddSurveyController(makeAddSurveyValidation(), makeDbAddSurvey())
  );
};
