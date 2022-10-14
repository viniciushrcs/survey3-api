import { SurveyModel } from '../../../../domain/models/survey';

export interface LoadSurveysRepository {
  loadAll(userId: string): Promise<SurveyModel[]>;
}
