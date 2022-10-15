import request from 'supertest';
import app from '../../../src/main/config/app';
import { MongoHelper } from '../../../src/infra/db/mongodb/helpers';
import { Collection } from 'mongodb';
import { sign } from 'jsonwebtoken';
import env from '../../../src/main/config/env';

let accountCollection: Collection;
let surveyCollection: Collection;
describe('Survey Routes', () => {
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

  describe('POST /surveys', () => {
    test('Should return 403 on survey without accessToken', async () => {
      await request(app)
        .post('/api/surveys')
        .send({
          question: 'any_question',
          answers: [
            {
              image: 'any_image',
              answer: 'any_answer'
            },
            {
              answer: 'any_answer_2'
            }
          ]
        })
        .expect(403);
    });

    test('Should return 204 on survey with accessToken', async () => {
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
      await request(app)
        .post('/api/surveys')
        .set('x-access-token', accessToken)
        .send({
          question: 'any_question',
          answers: [
            {
              image: 'any_image',
              answer: 'any_answer'
            },
            {
              answer: 'any_answer_2'
            }
          ]
        })
        .expect(204);
    });
  });

  describe('GET /surveys', () => {
    test('Should return 403 on survey without accessToken', async () => {
      await request(app).get('/api/surveys').send().expect(403);
    });

    test('Should return 204 on survey with accessToken and without surveys saved', async () => {
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
      await request(app)
        .get('/api/surveys')
        .set('x-access-token', accessToken)
        .send({})
        .expect(204);
    });

    test('Should return 200 on survey with accessToken and surveys saved', async () => {
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
      await surveyCollection.insertMany([
        {
          question: 'any_question',
          answers: [
            {
              image: 'any_image',
              answer: 'any_answer'
            }
          ],
          date: new Date()
        },
        {
          question: 'other_question',
          answers: [
            {
              image: 'other_image',
              answer: 'other_answer'
            }
          ],
          date: new Date()
        }
      ]);
      await request(app)
        .get('/api/surveys')
        .set('x-access-token', accessToken)
        .send({})
        .expect(200);
    });
  });
});
