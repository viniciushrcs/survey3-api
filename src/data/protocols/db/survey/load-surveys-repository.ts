import { SurveyModel } from '../../../../domain/models/survey';

export interface LoadSurveysRepository {
  load(): Promise<SurveyModel[]>;
}
