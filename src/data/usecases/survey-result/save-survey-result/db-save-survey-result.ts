import {
  SaveSurveyResult,
  SaveSurveyResultModel,
  SaveSurveyResultRepository,
  SurveyResultModel
} from './db-save-survey-result-protocols';

export class DbSaveSurveyResult implements SaveSurveyResult {
  constructor(
    private readonly saveSurveyResultRepository: SaveSurveyResultRepository
  ) {}
  async save(survey: SaveSurveyResultModel): Promise<SurveyResultModel> {
    return await this.saveSurveyResultRepository.save(survey);
  }
}
