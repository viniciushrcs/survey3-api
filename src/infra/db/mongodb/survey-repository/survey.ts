import { MongoHelper } from '../helpers/mongo-helper';
import { AddSurveyRepository } from '../../../../data/protocols/db/survey/add-survey-repository';
import { AddSurveyModel } from '../../../../domain/usecases/add-survey';
import { LoadSurveysRepository } from '../../../../data/protocols/db/survey/load-surveys-repository';
import { SurveyModel } from '../../../../domain/models/survey';
import { LoadSurveyByIdRepository } from '../../../../data/protocols/db/survey/load-survey-by-id-repository';

export class SurveyMongoRepository
  implements
    AddSurveyRepository,
    LoadSurveysRepository,
    LoadSurveyByIdRepository
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

  async loadById(id: string): Promise<SurveyModel> {
    const surveyCollection = MongoHelper.getCollection('surveys');
    const survey = await surveyCollection.findOne({ id });
    return MongoHelper.mapSurvey(survey);
  }
}
