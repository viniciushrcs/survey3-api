import { AddSurveyParams } from '../../../../domain/usecases/survey/add-survey';

export interface AddSurveyRepository {
  add(survey: AddSurveyParams): Promise<void>;
}
