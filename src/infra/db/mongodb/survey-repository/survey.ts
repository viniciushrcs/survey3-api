import { MongoHelper } from '../helpers/mongo-helper';
import { AddSurveyRepository } from '../../../../data/protocols/db/survey/add-survey-repository';
import { AddSurveyModel } from '../../../../domain/usecases/add-survey';
import { LoadSurveysRepository } from '../../../../data/protocols/db/survey/load-surveys-repository';
import { SurveyModel } from '../../../../domain/models/survey';

export class SurveyMongoRepository
  implements AddSurveyRepository, LoadSurveysRepository
{
  async add(survey: AddSurveyModel): Promise<void> {
    const surveyCollection = MongoHelper.getCollection('surveys');
    await surveyCollection.insertOne(survey);
  }

  async loadAll(): Promise<SurveyModel[]> {
    const surveyCollection = MongoHelper.getCollection('surveys');
    const surveys = await surveyCollection.find().toArray();
    return surveys.map((survey) => MongoHelper.mapSurvey(survey));
  }
}
