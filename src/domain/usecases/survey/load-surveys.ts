import { SurveyModel } from '../../models/survey';

export interface LoadSurveys {
  load(userId: string): Promise<SurveyModel[]>;
}
