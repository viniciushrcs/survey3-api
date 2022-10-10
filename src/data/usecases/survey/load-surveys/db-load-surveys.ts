import {
  LoadSurveys,
  LoadSurveysRepository,
  SurveyModel
} from './db-load-surveys-protocols';

export class DbLoadSurveys implements LoadSurveys {
  constructor(private readonly loadSurveyRepository: LoadSurveysRepository) {}
  async load(): Promise<SurveyModel[]> {
    await this.loadSurveyRepository.load();
    return null;
  }
}
