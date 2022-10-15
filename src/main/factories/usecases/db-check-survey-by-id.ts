import { SurveyMongoRepository } from '../../../infra/db/mongodb/survey-repository/survey';
import { DbCheckSurveyById } from '../../../data/usecases/survey/check-survey-by-id/db-check-survey-by-id';

export const makeDbCheckSurveyById = (): DbCheckSurveyById => {
  const surveyMongoRepository = new SurveyMongoRepository();
  return new DbCheckSurveyById(surveyMongoRepository);
};
