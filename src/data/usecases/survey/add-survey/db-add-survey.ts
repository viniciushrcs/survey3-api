import { AddSurvey, AddSurveyModel } from './db-add-survey-protocols';
import { AddSurveyRepository } from '../../../protocols/db/survey/add-survey-repository';

export class DbAddSurvey implements AddSurvey {
  constructor(private readonly addSurveyRepository: AddSurveyRepository) {}
  async add(survey: AddSurveyModel): Promise<void> {
    await this.addSurveyRepository.add(survey);
  }
}
