import { SurveyMongoRepository } from '../../../infra/db/mongodb/survey-repository/survey';
import { DbLoadSurveys } from '../../../data/usecases/survey/load-surveys/db-load-surveys';

export const makeDbLoadSurveys = (): DbLoadSurveys => {
  const surveyMongoRepository = new SurveyMongoRepository();
  return new DbLoadSurveys(surveyMongoRepository);
};
