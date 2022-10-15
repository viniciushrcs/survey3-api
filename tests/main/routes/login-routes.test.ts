import request from 'supertest';
import app from '../../../src/main/config/app';
import { MongoHelper } from '../../../src/infra/db/mongodb/helpers';
import { Collection } from 'mongodb';
import bcrypt from 'bcrypt';

let accountCollection: Collection;

describe('Login Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    accountCollection = MongoHelper.getCollection('accounts');
    await accountCollection.deleteMany({});
  });

  describe('POST /signup', () => {
    test('Should return 200 on signup', async () => {
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

  describe('POST /login', () => {
    test('Should return 200 on login', async () => {
      const password = await bcrypt.hash('password', 12);
      await accountCollection.insertOne({
        name: 'name',
        email: 'email@email.com',
        password
      });

      await request(app)
        .post('/api/login')
        .send({
          email: 'email@email.com',
          password: 'password'
        })
        .expect(200);
    });

    test('Should return 401 on failed login', async () => {
      await request(app)
        .post('/api/login')
        .send({
          email: 'email@email.com',
          password: 'password'
        })
        .expect(401);
    });
  });
});
