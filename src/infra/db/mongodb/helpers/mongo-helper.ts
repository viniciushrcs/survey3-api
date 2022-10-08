import { Collection, MongoClient } from 'mongodb';
import { AccountModel } from '../../../../domain/models/account';

export const MongoHelper = {
  client: null as MongoClient,

  async connect(uri: string): Promise<void> {
    this.client = await MongoClient.connect(uri);
  },

  async disconnect(): Promise<void> {
    await this.client.close();
  },

  getCollection(name: string): Collection {
    return this.client.db().collection(name);
  },

  mapAccount(collection: any): AccountModel {
    const { _id, ...collectionWithoutId } = collection;
    return Object.assign({}, collectionWithoutId, { id: _id });
  }
};
