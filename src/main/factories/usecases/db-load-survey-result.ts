import { SurveyResultMongoRepository } from '../../../infra/db/mongodb/survey-result-repository/survey-result';
import { SurveyMongoRepository } from '../../../infra/db/mongodb/survey-repository/survey';
import { DbLoadSurveyResult } from '../../../data/usecases/survey-result/load-survey-result/db-load-survey-result';

export const makeDbLoadSurveyResult = (): DbLoadSurveyResult => {
  const surveyResultMongoRepository = new SurveyResultMongoRepository();
  const surveyMongoRepository = new SurveyMongoRepository();
  return new DbLoadSurveyResult(
    surveyResultMongoRepository,
    surveyMongoRepository
  );
};
