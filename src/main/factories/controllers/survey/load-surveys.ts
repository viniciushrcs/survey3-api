import { Controller } from '../../../../presentation/protocols';
import { makeLogErrorDecorator } from '../../decorators/log-error';
import { LoadSurveysController } from '../../../../presentation/controllers/survey/load-survey/load-surveys';
import { makeDbLoadSurveys } from '../../usecases/db-load-surveys';

export const makeLoadSurveysController = (): Controller => {
  return makeLogErrorDecorator(new LoadSurveysController(makeDbLoadSurveys()));
};
