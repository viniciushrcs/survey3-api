import { SurveyResultMongoRepository } from './survey-result';
import { MongoHelper } from '../helpers';
import { Collection, ObjectId } from 'mongodb';
import { SaveSurveyResultParams } from '../../../../domain/usecases/survey-result/save-survey-result';
import { SurveyModel } from '../../../../domain/models/survey';
import { AccountModel } from '../../../../domain/models/account';

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

const makeSurvey = async (): Promise<SurveyModel> => {
  const res = await surveyCollection.insertOne({
    question: 'any_question',
    answers: [
      {
        image: 'any_image',
        answer: 'any_answer'
      },
      {
        answer: 'any_answer_2'
      },
      {
        answer: 'any_answer_3'
      },
      {
        answer: 'any_answer_4'
      }
    ],
    date: new Date()
  });

  return MongoHelper.map<SurveyModel>(
    await surveyCollection.findOne({
      _id: res.insertedId
    })
  );
};

const makeAccount = async (): Promise<AccountModel> => {
  const res = await accountCollection.insertOne({
    name: 'any_name',
    email: 'any_email@email.com',
    password: 'any_password'
  });

  return MongoHelper.map<AccountModel>(
    await accountCollection.findOne({
      _id: res.insertedId
    })
  );
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
        makeSaveSurveyResult(survey.id, survey.answers?.[0].answer, account.id)
      );

      expect(savedSurveyResult).toBeTruthy();
      expect(savedSurveyResult.surveyId).toEqual(survey.id);
      expect(savedSurveyResult.answers[0].answer).toBe(
        survey.answers?.[0].answer
      );
      expect(savedSurveyResult.answers[0].count).toBe(1);
      expect(savedSurveyResult.answers[0].percent).toBe(100);
      expect(savedSurveyResult.answers[1].percent).toBe(0);
      expect(savedSurveyResult.answers[1].percent).toBe(0);
    });

    test('Should update a survey result on success', async () => {
      const survey = await makeSurvey();
      const account = await makeAccount();
      await surveyResultCollection.insertOne({
        surveyId: new ObjectId(survey.id),
        answer: survey.answers?.[0].answer,
        userId: new ObjectId(account.id),
        date: new Date()
      });
      const sut = makeSut();
      const savedSurveyResult = await sut.save(
        makeSaveSurveyResult(survey.id, survey.answers?.[1].answer, account.id)
      );
      expect(savedSurveyResult).toBeTruthy();
      expect(savedSurveyResult.surveyId).toEqual(survey.id);
      expect(savedSurveyResult.answers[0].answer).toBe(
        survey.answers?.[1].answer
      );
      expect(savedSurveyResult.answers[0].count).toBe(1);
      expect(savedSurveyResult.answers[0].percent).toBe(100);
      expect(savedSurveyResult.answers[1].count).toBe(0);
      expect(savedSurveyResult.answers[1].percent).toBe(0);
    });
  });

  describe('loadBySurveyId', () => {
    test('Should load survey result with random results', async () => {
      const survey = await makeSurvey();
      const account = await makeAccount();
      await surveyResultCollection.insertMany([
        {
          surveyId: new ObjectId(survey.id),
          accountId: new ObjectId(account.id),
          answer: survey.answers[0].answer,
          date: new Date()
        },
        {
          surveyId: new ObjectId(survey.id),
          accountId: new ObjectId(account.id),
          answer: survey.answers[0].answer,
          date: new Date()
        },
        {
          surveyId: new ObjectId(survey.id),
          accountId: new ObjectId(account.id),
          answer: survey.answers[1].answer,
          date: new Date()
        },
        {
          surveyId: new ObjectId(survey.id),
          accountId: new ObjectId(account.id),
          answer: survey.answers[1].answer,
          date: new Date()
        }
      ]);
      const sut = makeSut();
      const surveyResult = await sut.loadBySurveyId(survey.id);
      expect(surveyResult).toBeTruthy();
      expect(surveyResult.surveyId).toEqual(survey.id);
      expect(surveyResult.answers[0].count).toBe(2);
      expect(surveyResult.answers[0].percent).toBe(50);
      expect(surveyResult.answers[1].count).toBe(2);
      expect(surveyResult.answers[1].percent).toBe(50);
      expect(surveyResult.answers[2].count).toBe(0);
      expect(surveyResult.answers[2].percent).toBe(0);
      expect(surveyResult.answers[3].count).toBe(0);
      expect(surveyResult.answers[3].percent).toBe(0);
    });
  });
});
