import { DbAddSurvey } from '../../../data/usecases/survey/add-survey/db-add-survey';
import { SurveyMongoRepository } from '../../../infra/db/mongodb/survey-repository/survey';

export const makeDbAddSurvey = (): DbAddSurvey => {
  const surveyMongoRepository = new SurveyMongoRepository();
  return new DbAddSurvey(surveyMongoRepository);
};
