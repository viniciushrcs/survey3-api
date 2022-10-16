import { Collection } from 'mongodb';
import { sign } from 'jsonwebtoken';
import request from 'supertest';
import { MongoHelper } from '../../../src/infra/db/mongodb/helpers';
import app from '../../../src/main/config/app';
import env from '../../../src/main/config/env';

let accountCollection: Collection;
let surveyCollection: Collection;

const mockAccessToken = async (): Promise<string> => {
  const res = await accountCollection.insertOne({
    name: 'Vinicius',
    email: 'vinicius@gmail.com',
    password: '123',
    role: 'admin'
  });
  const id = res.insertedId;
  const accessToken = sign({ id }, env.secret);
  await accountCollection.updateOne(
    {
      name: 'Vinicius'
    },
    {
      $set: {
        accessToken
      }
    }
  );
  return accessToken;
};

describe('SurveyResult GraphQL', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    surveyCollection = MongoHelper.getCollection('surveys');
    await surveyCollection.deleteMany({});
    accountCollection = MongoHelper.getCollection('accounts');
    await accountCollection.deleteMany({});
  });

  describe('SurveyResult Query', () => {
    test('Should return SurveyResult', async () => {
      const accessToken = await mockAccessToken();
      const now = new Date();
      const surveyRes = await surveyCollection.insertOne({
        question: 'Question',
        answers: [
          {
            answer: 'Answer 1',
            image: 'http://image-name.com'
          },
          {
            answer: 'Answer 2'
          }
        ],
        date: now
      });
      const query = `query {
        surveyResult (surveyId: "${surveyRes.insertedId}") {
          question
          answers {
            answer
            count
            percent
          }
          date
        }
      }`;
      const res = await request(app)
        .post('/graphql')
        .set('x-access-token', accessToken)
        .send({ query });
      expect(res.body.data.surveyResult.question).toBe('Question');
      expect(res.body.data.surveyResult.date).toBe(now.toISOString());
      expect(res.body.data.surveyResult.answers).toEqual([
        {
          answer: 'Answer 1',
          count: 0,
          percent: 0
        },
        {
          answer: 'Answer 2',
          count: 0,
          percent: 0
        }
      ]);
    });

    test('Should return AccessDeniedError if no token is provided', async () => {
      const surveyRes = await surveyCollection.insertOne({
        question: 'Question',
        answers: [
          {
            answer: 'Answer 1',
            image: 'http://image-name.com'
          },
          {
            answer: 'Answer 2'
          }
        ],
        date: new Date()
      });
      const query = `query {
        surveyResult (surveyId: "${surveyRes.insertedId}") {
          question
          answers {
            answer
            count
            percent
          }
          date
        }
      }`;
      const res = await request(app).post('/graphql').send({ query });
      expect(res.body.data).toBeFalsy();
      expect(res.body.errors[0].message).toBe('Access denied');
    });
  });

  describe('SaveSurveyResult Mutation', () => {
    test('Should return SurveyResult', async () => {
      const accessToken = await mockAccessToken();
      const now = new Date();
      const surveyRes = await surveyCollection.insertOne({
        question: 'Question',
        answers: [
          {
            answer: 'Answer 1',
            image: 'http://image-name.com'
          },
          {
            answer: 'Answer 2'
          }
        ],
        date: now
      });
      const query = `mutation {
        saveSurveyResult (surveyId: "${surveyRes.insertedId}", answer: "Answer 1") {
          question
          answers {
            answer
            count
            percent
          }
          date
        }
      }`;
      const res = await request(app)
        .post('/graphql')
        .set('x-access-token', accessToken)
        .send({ query });
      expect(res.body.data.saveSurveyResult.question).toBe('Question');
      expect(res.body.data.saveSurveyResult.date).toBe(now.toISOString());
      expect(res.body.data.saveSurveyResult.answers).toEqual([
        {
          answer: 'Answer 1',
          count: 1,
          percent: 100
        },
        {
          answer: 'Answer 2',
          count: 0,
          percent: 0
        }
      ]);
    });

    test('Should return AccessDeniedError if no token is provided', async () => {
      const surveyRes = await surveyCollection.insertOne({
        question: 'Question',
        answers: [
          {
            answer: 'Answer 1',
            image: 'http://image-name.com'
          },
          {
            answer: 'Answer 2'
          }
        ],
        date: new Date()
      });
      const query = `mutation {
        saveSurveyResult (surveyId: "${surveyRes.insertedId}", answer: "Answer 1") {
          question
          answers {
            answer
            count
            percent
          }
          date
        }
      }`;
      const res = await request(app).post('/graphql').send({ query });
      expect(res.body.data).toBeFalsy();
      expect(res.body.errors[0].message).toBe('Access denied');
    });
  });
});
