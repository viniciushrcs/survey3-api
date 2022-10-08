import request from 'supertest';
import app from '../config/app';
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper';

describe('Login Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    const accountCollection = MongoHelper.getCollection('accounts');
    await accountCollection.deleteMany({});
  });

  describe('POST /signup', () => {
    test('Should return an account on signup', async () => {
      await request(app)
        .post('/api/signup')
        .send({
          name: 'name',
          email: 'email@email.com',
          password: 'password',
          passwordConfirmation: 'password'
        })
        .expect(200);
    });
  });
});
