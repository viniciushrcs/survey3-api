import { MongoHelper } from '../helpers/mongo-helper';
import { AddSurveyRepository } from '../../../../data/protocols/db/survey/add-survey-repository';
import { AddSurveyModel } from '../../../../domain/usecases/add-survey';

export class SurveyMongoRepository implements AddSurveyRepository {
  async add(survey: AddSurveyModel): Promise<void> {
    const surveyCollection = MongoHelper.getCollection('surveys');
    await surveyCollection.insertOne(survey);
  }
}
