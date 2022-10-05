import { AccountMongoRepository } from './account';
import { MongoHelper } from '../helpers/mongo-helper';

describe('Account Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  test('Should return an account on sucess', async () => {
    const sut = new AccountMongoRepository();
    const newAccount = await sut.add({
      name: 'any_name',
      email: 'any_email@email.com',
      password: 'any_password'
    });

    expect(newAccount.name).toBe('any_name');
    expect(newAccount.email).toBe('any_email@email.com');
    expect(newAccount.password).toBe('any_password');
    expect(newAccount).toHaveProperty('id');
    expect(newAccount).toBeTruthy();
  });
});
