import { SurveyMongoRepository } from './survey';
import { MongoHelper } from '../helpers/mongo-helper';
import { Collection } from 'mongodb';
import { AddSurveyModel } from '../../../../domain/usecases/add-survey';

let surveyCollection: Collection;
const makeAddSurvey = (): AddSurveyModel => ({
  question: 'any_question',
  answers: [
    {
      image: 'any_image',
      answer: 'any_answer'
    },
    {
      answer: 'any_answer_2'
    }
  ],
  date: new Date()
});

describe('Survey Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    surveyCollection = MongoHelper.getCollection('surveys');
    await surveyCollection.deleteMany({});
  });

  const makeSut = () => {
    return new SurveyMongoRepository();
  };

  describe('add', () => {
    test('Should add a new survey on success', async () => {
      const sut = makeSut();
      const surveyBefore = await surveyCollection.findOne({
        question: 'any_question'
      });
      expect(surveyBefore).toBeFalsy();

      await sut.add(makeAddSurvey());
      const surveyAfter = await surveyCollection.findOne({
        question: 'any_question'
      });
      expect(surveyAfter).toBeTruthy();
    });
  });
});
