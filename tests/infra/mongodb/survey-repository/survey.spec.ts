import { SurveyMongoRepository } from '../../../../src/infra/db/mongodb/survey-repository/survey';
import { MongoHelper } from '../../../../src/infra/db/mongodb/helpers';
import { Collection } from 'mongodb';
import { AddSurveyParams } from '../../../../src/domain/usecases/survey/add-survey';
import { SurveyModel } from '../../../../src/domain/models/survey';
import { AccountModel } from '../../../../src/domain/models/account';

let surveyCollection: Collection;
let surveyResultCollection: Collection;
let accountCollection: Collection;

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

const makeAddSurvey = (question): AddSurveyParams => ({
  question,
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
    surveyResultCollection = MongoHelper.getCollection('surveyResults');
    await surveyResultCollection.deleteMany({});
    surveyCollection = MongoHelper.getCollection('surveys');
    await surveyCollection.deleteMany({});
    accountCollection = MongoHelper.getCollection('accounts');
    await accountCollection.deleteMany({});
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

      await sut.add(makeAddSurvey('any_question'));
      const surveyAfter = await surveyCollection.findOne({
        question: 'any_question'
      });
      expect(surveyAfter).toBeTruthy();
    });
  });

  describe('loadAll', () => {
    test('Should load all surveys on success', async () => {
      const account = await makeAccount();
      const sut = makeSut();
      const { insertedIds } = await surveyCollection.insertMany([
        makeAddSurvey('any_question'),
        makeAddSurvey('other_question')
      ]);
      await surveyResultCollection.insertOne({
        surveyId: insertedIds[0],
        userId: account.id,
        answer: 'any_answer',
        date: new Date()
      });
      const surveys = await sut.loadAll(account.id);
      expect(surveys.length).toBe(2);
      expect(surveys[0].question).toBe('any_question');
      expect(surveys[0].id).toBeTruthy();
      expect(surveys[1].id).toBeTruthy();
      expect(surveys[0].didAnswer).toBeTruthy();
      expect(surveys[1].didAnswer).toBeFalsy();
      expect(surveys[1].question).toBe('other_question');
    });

    test('Should load empty list', async () => {
      const account = await makeAccount();
      const sut = makeSut();
      const surveys = await sut.loadAll(account.id);
      expect(surveys.length).toBe(0);
    });
  });

  describe('loadById', () => {
    test('Should load one survey by id on success', async () => {
      const sut = makeSut();
      await surveyCollection.insertOne(makeAddSurvey('any_question'));
      const savedResult = await surveyCollection.findOne({
        question: 'any_question'
      });
      const survey = await sut.loadById(
        MongoHelper.map<SurveyModel>(savedResult).id
      );
      expect(survey).toBeTruthy();
    });
  });
});
