import { MongoHelper } from '../../../../src/infra/db/mongodb/helpers';
import { Collection } from 'mongodb';
import { LogMongoRepository } from '../../../../src/infra/db/mongodb/logger-repository/log';

describe('Log Mongo Repository ', () => {
  let errorCollection: Collection;
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    errorCollection = MongoHelper.getCollection('error');
    await errorCollection.deleteMany({});
  });

  const makeSut = () => {
    return new LogMongoRepository();
  };

  test('Should create an error log on success', async () => {
    const sut = makeSut();
    await sut.logError('any_error');
    const count = await errorCollection.countDocuments();
    expect(count).toBe(1);
  });
});
