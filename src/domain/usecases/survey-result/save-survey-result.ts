import { SurveyResultModel } from '../../models/survey-result';

export type SaveSurveyResultParams = Omit<SurveyResultModel, 'id'>;

export interface SaveSurveyResult {
  save(surveyResult: SaveSurveyResultParams): Promise<SurveyResultModel>;
}
