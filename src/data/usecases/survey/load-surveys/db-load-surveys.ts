import {
  LoadSurveys,
  LoadSurveysRepository,
  SurveyModel
} from './db-load-surveys-protocols';

export class DbLoadSurveys implements LoadSurveys {
  constructor(private readonly loadSurveyRepository: LoadSurveysRepository) {}
  async load(userId: string): Promise<SurveyModel[]> {
    return await this.loadSurveyRepository.loadAll(userId);
  }
}
