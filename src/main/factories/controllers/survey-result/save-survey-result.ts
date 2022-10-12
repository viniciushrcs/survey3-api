import { Controller } from '../../../../presentation/protocols';
import { makeLogErrorDecorator } from '../../decorators/log-error';
import { SaveSurveyResultController } from '../../../../presentation/controllers/survey-result/save-survey-result/save-survey-result-controller';
import { makeDbLoadSurveyById } from '../../usecases/db-load-survey-by-id';
import { makeDbSaveSurveyResult } from '../../usecases/db-save-survey-result';

export const makeSaveSurveyResultController = (): Controller => {
  return makeLogErrorDecorator(
    new SaveSurveyResultController(
      makeDbLoadSurveyById(),
      makeDbSaveSurveyResult()
    )
  );
};
