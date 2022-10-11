import { SurveyMongoRepository } from './survey';
import { MongoHelper } from '../helpers/mongo-helper';
import { Collection } from 'mongodb';
import { AddSurveyModel } from '../../../../domain/usecases/add-survey';
import { SaveSurveyResultModel } from '../../../../domain/usecases/save-survey-result';

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

const makeSaveSurveyResult = (): SaveSurveyResultModel => ({
  surveyId: 'survey_id',
  userId: 'user_id',
  answer: 'any_answer_2',
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

  describe('loadAll', () => {
    test('Should load all surveys on success', async () => {
      const sut = makeSut();
      await surveyCollection.insertMany([
        makeAddSurvey(),
        {
          question: 'other_question',
          answers: [
            {
              image: 'other_image',
              answer: 'other_answer'
            },
            {
              answer: 'other_answer_2'
            }
          ],
          date: new Date()
        }
      ]);
      const surveys = await sut.loadAll();
      expect(surveys.length).toBe(2);
      expect(surveys[0].question).toBe('any_question');
      expect(surveys[1].question).toBe('other_question');
    });

    test('Should load empty list', async () => {
      const sut = makeSut();
      const surveys = await sut.loadAll();
      expect(surveys.length).toBe(0);
    });
  });

  describe('loadById', () => {
    test('Should load one survey by id on success', async () => {
      const sut = makeSut();

      const surveyBefore = await surveyCollection.findOne({
        surveyId: 'survey_id'
      });
      expect(surveyBefore).toBeFalsy();
      const savedResult = await surveyCollection.insertOne(
        makeSaveSurveyResult()
      );
      await sut.loadById(MongoHelper.mapSurvey(savedResult).id);
      const surveyAfter = await surveyCollection.findOne({
        surveyId: 'survey_id'
      });
      expect(surveyAfter).toBeTruthy();
    });
  });
});
