import { DbSaveSurveyResult } from '../../../data/usecases/survey-result/save-survey-result/db-save-survey-result';
import { SurveyResultMongoRepository } from '../../../infra/db/mongodb/survey-result-repository/survey-result';

export const makeDbSaveSurveyResult = (): DbSaveSurveyResult => {
  const surveyResultMongoRepository = new SurveyResultMongoRepository();
  return new DbSaveSurveyResult(surveyResultMongoRepository);
};
