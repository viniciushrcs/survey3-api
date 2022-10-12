import { SaveSurveyResultRepository } from '../../../../data/protocols/db/save-survey/save-survey-result-repository';
import { SaveSurveyResultParams } from '../../../../domain/usecases/survey-result/save-survey-result';
import { MongoHelper, QueryBuilder } from '../helpers';
import { SurveyResultModel } from '../../../../domain/models/survey-result';
import { ObjectId } from 'mongodb';

export class SurveyResultMongoRepository implements SaveSurveyResultRepository {
  async save(surveyResult: SaveSurveyResultParams): Promise<SurveyResultModel> {
    const surveyResultCollection = MongoHelper.getCollection('surveyResults');
    await surveyResultCollection.findOneAndUpdate(
      {
        surveyId: new ObjectId(surveyResult.surveyId),
        userId: new ObjectId(surveyResult.userId)
      },
      {
        $set: {
          answer: surveyResult.answer,
          date: surveyResult.date
        }
      },
      {
        upsert: true
      }
    );
    return await this.loadBySurveyId(surveyResult.surveyId);
  }

  private async loadBySurveyId(surveyId: string): Promise<SurveyResultModel> {
    const surveyResultCollection = MongoHelper.getCollection('surveyResults');
    const query = new QueryBuilder()
      .match({
        surveyId: new ObjectId(surveyId)
      })
      .group({
        _id: 0,
        data: {
          $push: '$$ROOT'
        },
        count: {
          $sum: 1
        }
      })
      .unwind({
        path: '$data'
      })
      .lookup({
        from: 'surveys',
        foreignField: '_id',
        localField: 'data.surveyId',
        as: 'survey'
      })
      .unwind({
        path: '$survey'
      })
      .group({
        _id: {
          surveyId: '$survey._id',
          question: '$survey.question',
          date: '$survey.date',
          total: '$count',
          answer: {
            $filter: {
              input: '$survey.answers',
              as: 'item',
              cond: {
                $eq: ['$$item.answer', '$data.answer']
              }
            }
          }
        },
        count: {
          $sum: 1
        }
      })
      .unwind({
        path: '$_id.answer'
      })
      .addFields({
        '_id.answer.count': '$count',
        '_id.answer.percent': {
          $multiply: [
            {
              $divide: ['$count', '$_id.total']
            },
            100
          ]
        }
      })
      .group({
        _id: {
          surveyId: '$_id.surveyId',
          question: '$_id.question',
          date: '$_id.date'
        },
        answers: {
          $push: '$_id.answer'
        }
      })
      .project({
        _id: 0,
        surveyId: '$_id.surveyId',
        question: '$_id.question',
        date: '$_id.date',
        answers: '$answers'
      })
      .build();
    const [surveyResult = []] = await surveyResultCollection
      .aggregate(query)
      .toArray();

    if (surveyResult) {
      return {
        surveyId: surveyResult.surveyId,
        question: surveyResult.question,
        date: surveyResult.date,
        answers: surveyResult.answers
      };
    }
    return null;
  }
}
