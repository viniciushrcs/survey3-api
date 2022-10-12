import { SurveyResultMongoRepository } from './survey-result';
import { MongoHelper } from '../helpers/mongo-helper';
import { Collection } from 'mongodb';
import { SaveSurveyResultParams } from '../../../../domain/usecases/survey-result/save-survey-result';

let surveyResultCollection: Collection;
let surveyCollection: Collection;
let accountCollection: Collection;

const makeSaveSurveyResult = (
  id: string,
  answer: string,
  userId: string
): SaveSurveyResultParams => ({
  surveyId: id,
  userId,
  answer,
  date: new Date()
});

const makeSurvey = async (): Promise<any> => {
  const res = await surveyCollection.insertOne({
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

  return await surveyCollection.findOne({
    _id: res.insertedId
  });
};

const makeAccount = async (): Promise<any> => {
  const res = await accountCollection.insertOne({
    name: 'any_name',
    email: 'any_email@email.com',
    password: 'any_password'
  });

  return await accountCollection.findOne({
    _id: res.insertedId
  });
};

describe('SurveyResult Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    surveyResultCollection = MongoHelper.getCollection('surveyResults');
    await surveyResultCollection.deleteMany({});
    surveyCollection = MongoHelper.getCollection('surveys');
    await surveyCollection.deleteMany({});
    accountCollection = MongoHelper.getCollection('accounts');
    await accountCollection.deleteMany({});
  });

  const makeSut = () => {
    return new SurveyResultMongoRepository();
  };

  describe('save', () => {
    test('Should save a new survey result on success', async () => {
      const survey = await makeSurvey();
      const account = await makeAccount();
      const sut = makeSut();
      const savedSurveyResult = await sut.save(
        makeSaveSurveyResult(
          survey._id,
          survey.answers?.[0].answer,
          account._id
        )
      );
      expect(savedSurveyResult).toBeTruthy();
      expect(savedSurveyResult.id).toBeTruthy();
      expect(savedSurveyResult.answer).toBe(survey.answers?.[0].answer);
    });

    test('Should update a survey result on success', async () => {
      const survey = await makeSurvey();
      const account = await makeAccount();
      await surveyResultCollection.insertOne(
        makeSaveSurveyResult(
          survey._id,
          survey.answers?.[0].answer,
          account._id
        )
      );
      const sut = makeSut();
      const savedSurveyResult = await sut.save(
        makeSaveSurveyResult(
          survey._id,
          survey.answers?.[1].answer,
          account._id
        )
      );
      expect(savedSurveyResult).toBeTruthy();
      expect(savedSurveyResult.id).toBeTruthy();
      expect(savedSurveyResult.answer).not.toBe(survey.answers?.[0].answer);
      expect(savedSurveyResult.answer).toBe(survey.answers?.[1].answer);
    });
  });
});
