import { Collection } from 'mongodb';
import { hash } from 'bcrypt';
import request from 'supertest';
import { MongoHelper } from '../../../src/infra/db/mongodb/helpers';
import app from '../../../src/main/config/app';

let accountCollection: Collection;

describe('Login GraphQL', () => {
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

  describe('Login Query', () => {
    const query = `query {
      login (email: "vinicius@gmail.com", password: "123") {
        accessToken
        name
      }
    }`;

    test('Should return an Account on valid credentials', async () => {
      const password = await hash('123', 12);
      await accountCollection.insertOne({
        name: 'Vinicius',
        email: 'vinicius@gmail.com',
        password
      });
      const res = await request(app).post('/graphql').send({ query });
      expect(res.body.data.login.accessToken).toBeTruthy();
      expect(res.body.data.login.name).toBe('Vinicius');
    });

    test('Should return UnauthorizedError on invalid credentials', async () => {
      const res = await request(app).post('/graphql').send({ query });
      expect(res.body.data).toBeFalsy();
      expect(res.body.errors[0].message).toBe('Unauthorized');
    });
  });
});
