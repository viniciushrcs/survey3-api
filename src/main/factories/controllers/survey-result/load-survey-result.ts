import { Controller } from '../../../../presentation/protocols';
import { makeLogErrorDecorator } from '../../decorators/log-error';
import { makeDbLoadSurveyResult } from '../../usecases/db-load-survey-result';
import { LoadSurveyResultController } from '../../../../presentation/controllers/survey-result/load-survey-result/load-survey-result-controller';
import { makeDbCheckSurveyById } from '../../usecases/db-check-survey-by-id';

export const makeLoadSurveyResultController = (): Controller => {
  return makeLogErrorDecorator(
    new LoadSurveyResultController(
      makeDbCheckSurveyById(),
      makeDbLoadSurveyResult()
    )
  );
};
