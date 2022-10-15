import {
  LoadSurveyResult,
  LoadSurveyResultRepository,
  SurveyResultModel
} from './db-load-survey-result-protocols';
import { LoadSurveyByIdRepository } from '../../../protocols/db/survey/load-survey-by-id-repository';

export class DbLoadSurveyResult implements LoadSurveyResult {
  constructor(
    private readonly loadSurveyResultRepository: LoadSurveyResultRepository,
    private readonly loadSurveyByIdRepository: LoadSurveyByIdRepository
  ) {}

  async load(surveyId: string): Promise<SurveyResultModel> {
    let surveyResult = await this.loadSurveyResultRepository.loadBySurveyId(
      surveyId
    );
    if (!surveyResult) {
      const surveyById = await this.loadSurveyByIdRepository.loadById(surveyId);
      surveyResult = {
        surveyId: surveyById.id,
        question: surveyById.question,
        date: surveyById.date,
        answers: surveyById.answers.map((answer) => ({
          ...answer,
          count: 0,
          percent: 0
        }))
      };
    }
    return surveyResult;
  }
}
