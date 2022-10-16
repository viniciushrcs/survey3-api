import { Collection } from 'mongodb';
import { hash } from 'bcrypt';
import request from 'supertest';
import { MongoHelper } from '../../../src/infra/db/mongodb/helpers';
import app from '../../../src/main/config/app';

let accountCollection: Collection;

describe('SignUp GraphQL', () => {
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

  describe('SignUp Mutation', () => {
    const query = `mutation {
      signUp (name: "Vinicius", email: "vinicius@gmail.com", password: "123", passwordConfirmation: "123") {
        accessToken
        name
      }
    }`;

    test('Should return an Account on valid data', async () => {
      const res = await request(app).post('/graphql').send({ query });
      expect(res.body.data.signUp.accessToken).toBeTruthy();
      expect(res.body.data.signUp.name).toBe('Vinicius');
    });

    test('Should return EmailInUseError on invalid data', async () => {
      const password = await hash('123', 12);
      await accountCollection.insertOne({
        name: 'Vinicius',
        email: 'vinicius@gmail.com',
        password
      });
      const res = await request(app).post('/graphql').send({ query });
      expect(res.body.data).toBeFalsy();
      expect(res.body.errors[0].message).toBe(
        'The received email is already in use'
      );
    });
  });
});
