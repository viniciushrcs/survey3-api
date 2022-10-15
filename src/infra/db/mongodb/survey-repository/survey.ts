import { AddSurveyRepository } from '../../../../data/protocols/db/survey/add-survey-repository';
import { AddSurveyParams } from '../../../../domain/usecases/survey/add-survey';
import { LoadSurveysRepository } from '../../../../data/protocols/db/survey/load-surveys-repository';
import { SurveyModel } from '../../../../domain/models/survey';
import { LoadSurveyByIdRepository } from '../../../../data/protocols/db/survey/load-survey-by-id-repository';
import { ObjectId } from 'mongodb';
import { MongoHelper, QueryBuilder } from '../helpers';
import { CheckSurveyById } from '../../../../domain/usecases/survey/check-survey-by-id';

export class SurveyMongoRepository
  implements
    AddSurveyRepository,
    LoadSurveysRepository,
    LoadSurveyByIdRepository,
    CheckSurveyById
{
  async add(survey: AddSurveyParams): Promise<void> {
    const surveyCollection = MongoHelper.getCollection('surveys');
    await surveyCollection.insertOne(survey);
  }

  async loadAll(userId: string): Promise<SurveyModel[]> {
    const surveyCollection = MongoHelper.getCollection('surveys');
    const query = new QueryBuilder()
      .lookup({
        from: 'surveyResults',
        foreignField: 'surveyId',
        localField: '_id',
        as: 'result'
      })
      .project({
        _id: 1,
        question: 1,
        answers: 1,
        date: 1,
        didAnswer: {
          $gte: [
            {
              $size: {
                $filter: {
                  input: '$result',
                  as: 'item',
                  cond: {
                    $eq: ['$$item.userId', new ObjectId(userId)]
                  }
                }
              }
            },
            1
          ]
        }
      })
      .build();
    const surveys = await surveyCollection.aggregate(query).toArray();
    return MongoHelper.mapCollection<SurveyModel>(surveys);
  }

  async loadById(id: string): Promise<SurveyModel> {
    const surveyCollection = MongoHelper.getCollection('surveys');
    const survey = await surveyCollection.findOne({ _id: new ObjectId(id) });
    return MongoHelper.map<SurveyModel>(survey);
  }

  async checkById(id: string): Promise<boolean> {
    const surveyCollection = await MongoHelper.getCollection('surveys');
    const survey = await surveyCollection.findOne(
      {
        _id: new ObjectId(id)
      },
      {
        projection: {
          _id: 1
        }
      }
    );
    return survey !== null;
  }
}
