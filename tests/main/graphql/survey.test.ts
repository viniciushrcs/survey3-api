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

describe('Survey GraphQL', () => {
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

  describe('Surveys Query', () => {
    const query = `query {
      surveys {
        id
        question
        answers {
          image
          answer
        }
        date
        didAnswer
      }
    }`;

    test('Should return Surveys', async () => {
      const accessToken = await mockAccessToken();
      const now = new Date();
      await surveyCollection.insertOne({
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
      const res = await request(app)
        .post('/graphql')
        .set('x-access-token', accessToken)
        .send({ query });

      expect(res.body.data.surveys.length).toBe(1);
      expect(res.body.data.surveys[0].id).toBeTruthy();
      expect(res.body.data.surveys[0].question).toBe('Question');
      expect(res.body.data.surveys[0].date).toBe(now.toISOString());
      expect(res.body.data.surveys[0].didAnswer).toBe(false);
      expect(res.body.data.surveys[0].answers).toEqual([
        {
          answer: 'Answer 1',
          image: 'http://image-name.com'
        },
        {
          answer: 'Answer 2',
          image: null
        }
      ]);
    });

    test('Should return AccessDeniedError if no token is provided', async () => {
      await surveyCollection.insertOne({
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
      const res = await request(app).post('/graphql').send({ query });
      expect(res.body.data).toBeFalsy();
      expect(res.body.errors[0].message).toBe('Access denied');
    });
  });
});
