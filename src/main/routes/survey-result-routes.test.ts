import request from 'supertest';
import app from '../config/app';
import { MongoHelper } from '../../infra/db/mongodb/helpers';
import { Collection } from 'mongodb';
import { sign } from 'jsonwebtoken';
import env from '../config/env';

let accountCollection: Collection;
let surveyCollection: Collection;
describe('SurveyResult Routes', () => {
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

  describe('PUT /surveys/:surveyId/results', () => {
    test('Should return 403 on save survey result without accessToken', async () => {
      await request(app)
        .put('/api/surveys/any_id/results')
        .send({
          answer: 'any_answer'
        })
        .expect(403);
    });

    test('Should return 200 on save survey result with accessToken', async () => {
      const res = await accountCollection.insertOne({
        name: 'name',
        email: 'email@email.com',
        password: '123',
        role: 'admin'
      });
      const id = res.insertedId;
      const accessToken = sign({ id }, env.secret);
      await accountCollection.updateOne(
        {
          name: 'name'
        },
        {
          $set: {
            accessToken
          }
        }
      );
      const survey = await surveyCollection.insertOne({
        question: 'any_question',
        answers: [
          {
            image: 'any_image',
            answer: 'any_answer'
          },
          {
            answer: 'answer_2'
          }
        ],
        date: new Date()
      });
      await request(app)
        .put(`/api/surveys/${survey.insertedId.toString()}/results`)
        .set('x-access-token', accessToken)
        .send({
          answer: 'any_answer'
        })
        .expect(200);
    });
  });
});
