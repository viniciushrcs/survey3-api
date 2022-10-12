import {
  LoadSurveyResultRepository,
  SaveSurveyResult,
  SaveSurveyResultParams,
  SaveSurveyResultRepository,
  SurveyResultModel
} from './db-save-survey-result-protocols';

export class DbSaveSurveyResult implements SaveSurveyResult {
  constructor(
    private readonly saveSurveyResultRepository: SaveSurveyResultRepository,
    private readonly loadSurveyResultRepository: LoadSurveyResultRepository
  ) {}
  async save(survey: SaveSurveyResultParams): Promise<SurveyResultModel> {
    await this.saveSurveyResultRepository.save(survey);
    return await this.loadSurveyResultRepository.loadBySurveyId(
      survey.surveyId
    );
  }
}
