import { SurveyResultModel } from '../../models/survey-result';

export interface SaveSurveyResultParams {
  surveyId: string;
  userId: string;
  answer: string;
  date: Date;
}

export interface SaveSurveyResult {
  save(surveyResult: SaveSurveyResultParams): Promise<SurveyResultModel>;
}
