import { SaveSurveyResultRepository } from '../../../../data/protocols/db/survey/save-survey-result-repository';
import { SaveSurveyResultModel } from '../../../../domain/usecases/save-survey-result';
import { MongoHelper } from '../helpers/mongo-helper';
import { SurveyResultModel } from '../../../../domain/models/survey-result';

export class SurveyResultMongoRepository implements SaveSurveyResultRepository {
  async save(surveyResult: SaveSurveyResultModel): Promise<SurveyResultModel> {
    const surveyResultCollection = MongoHelper.getCollection('surveyResults');
    const savedSurveyResult = await surveyResultCollection.findOneAndUpdate(
      {
        surveyId: surveyResult.surveyId,
        userId: surveyResult.userId
      },
      {
        $set: {
          answer: surveyResult.answer,
          date: surveyResult.date
        }
      },
      {
        upsert: true,
        returnDocument: 'after'
      }
    );
    return (
      savedSurveyResult && MongoHelper.mapSurveyResult(savedSurveyResult.value)
    );
  }
}
