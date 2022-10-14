import { Controller } from '../../../../presentation/protocols';
import { makeLogErrorDecorator } from '../../decorators/log-error';
import { makeDbLoadSurveyById } from '../../usecases/db-load-survey-by-id';
import { makeDbLoadSurveyResult } from '../../usecases/db-load-survey-result';
import { LoadSurveyResultController } from '../../../../presentation/controllers/survey-result/load-survey-result/load-survey-result-controller';

export const makeLoadSurveyResultController = (): Controller => {
  return makeLogErrorDecorator(
    new LoadSurveyResultController(
      makeDbLoadSurveyById(),
      makeDbLoadSurveyResult()
    )
  );
};
