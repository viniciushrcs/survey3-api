import { SaveSurveyResultModel } from '../../../../domain/usecases/save-survey-result';
import { SurveyResultModel } from '../../../../domain/models/survey-result';

export interface SaveSurveyResultRepository {
  save(survey: SaveSurveyResultModel): Promise<SurveyResultModel>;
}
