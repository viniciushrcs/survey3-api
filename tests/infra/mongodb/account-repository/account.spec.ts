import { AccountMongoRepository } from '../../../../src/infra/db/mongodb/account-repository/account';
import { MongoHelper } from '../../../../src/infra/db/mongodb/helpers';
import { Collection } from 'mongodb';

let accountCollection: Collection;
const makeFakeAccount = () => ({
  name: 'any_name',
  email: 'any_email@email.com',
  password: 'any_password'
});

describe('Account Mongo Repository', () => {
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

  const makeSut = () => {
    return new AccountMongoRepository();
  };

  describe('add', () => {
    test('Should return an account on add sucess', async () => {
      const sut = makeSut();
      const newAccount = await sut.add(makeFakeAccount());

      expect(newAccount.name).toBe('any_name');
      expect(newAccount.email).toBe('any_email@email.com');
      expect(newAccount.password).toBe('any_password');
      expect(newAccount).toHaveProperty('id');
      expect(newAccount).toBeTruthy();
    });
  });

  describe('loadAccountByEmail', () => {
    test('Should return an account on loadAccountByEmail success', async () => {
      const sut = makeSut();
      await accountCollection.insertOne(makeFakeAccount());
      const foundAccount = await sut.loadAccountByEmail('any_email@email.com');

      expect(foundAccount.name).toBe('any_name');
      expect(foundAccount.email).toBe('any_email@email.com');
      expect(foundAccount.password).toBe('any_password');
      expect(foundAccount).toHaveProperty('id');
      expect(foundAccount).toBeTruthy();
    });

    test('Should return null if loadAccountByEmail fails', async () => {
      const sut = makeSut();
      const foundAccount = await sut.loadAccountByEmail('any_email@email.com');
      expect(foundAccount).toBeFalsy();
    });
  });

  describe('updateAccessToken', () => {
    test('Should update the account accessToken on updateAccessToken success', async () => {
      const sut = makeSut();

      const account = await accountCollection.insertOne(makeFakeAccount());
      const accountBeforeUpdate = await accountCollection.findOne({
        _id: account.insertedId
      });
      expect(accountBeforeUpdate.accessToken).toBeFalsy();

      await sut.updateAccessToken(
        accountBeforeUpdate._id as unknown as string,
        'any_token'
      );
      const accountAfterUpdate = await accountCollection.findOne({
        _id: accountBeforeUpdate._id
      });
      expect(accountAfterUpdate.accessToken).toBe('any_token');
    });
  });

  describe('loadByToken', () => {
    test('Should return an account on loadAccountByToken success, without role', async () => {
      const sut = makeSut();
      await accountCollection.insertOne({
        name: 'any_name',
        email: 'any_email@email.com',
        password: 'any_password',
        accessToken: 'any_token'
      });
      const foundAccount = await sut.loadAccountByToken('any_token');

      expect(foundAccount.name).toBe('any_name');
      expect(foundAccount.email).toBe('any_email@email.com');
      expect(foundAccount.password).toBe('any_password');
      expect(foundAccount).toHaveProperty('id');
      expect(foundAccount).toBeTruthy();
    });

    test('Should return an account on loadAccountByToken success, with admin role', async () => {
      const sut = makeSut();
      await accountCollection.insertOne({
        name: 'any_name',
        email: 'any_email@email.com',
        password: 'any_password',
        accessToken: 'any_token',
        role: 'admin'
      });
      const foundAccount = await sut.loadAccountByToken('any_token', 'admin');

      expect(foundAccount.name).toBe('any_name');
      expect(foundAccount.email).toBe('any_email@email.com');
      expect(foundAccount.password).toBe('any_password');
      expect(foundAccount).toHaveProperty('id');
      expect(foundAccount).toBeTruthy();
    });

    test('Should return null on loadAccountByToken success, with invalid role', async () => {
      const sut = makeSut();
      await accountCollection.insertOne({
        name: 'any_name',
        email: 'any_email@email.com',
        password: 'any_password',
        accessToken: 'any_token'
      });
      const foundAccount = await sut.loadAccountByToken('any_token', 'admin');

      expect(foundAccount).toBeFalsy();
    });

    test('Should return an account on loadAccountByToken success, if user is admin', async () => {
      const sut = makeSut();
      await accountCollection.insertOne({
        name: 'any_name',
        email: 'any_email@email.com',
        password: 'any_password',
        accessToken: 'any_token',
        role: 'admin'
      });
      const foundAccount = await sut.loadAccountByToken('any_token');

      expect(foundAccount.name).toBe('any_name');
      expect(foundAccount.email).toBe('any_email@email.com');
      expect(foundAccount.password).toBe('any_password');
      expect(foundAccount).toHaveProperty('id');
      expect(foundAccount).toBeTruthy();
    });

    test('Should return null if loadAccountByEmail fails', async () => {
      const sut = makeSut();
      const foundAccount = await sut.loadAccountByToken('any_token');
      expect(foundAccount).toBeFalsy();
    });
  });

  describe('checkByEmail', () => {
    test('Should return true if email exists', async () => {
      const sut = makeSut();
      const addAccountParams = makeFakeAccount();
      await accountCollection.insertOne(addAccountParams);
      const exists = await sut.checkByEmail(addAccountParams.email);
      expect(exists).toBe(true);
    });

    test('Should return false if email does not exist', async () => {
      const sut = makeSut();
      const exists = await sut.checkByEmail('email@email.com');
      expect(exists).toBe(false);
    });
  });
});
