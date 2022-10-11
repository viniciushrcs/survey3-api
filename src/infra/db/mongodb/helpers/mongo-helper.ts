import { Collection, MongoClient } from 'mongodb';
import { AccountModel } from '../../../../domain/models/account';
import { SurveyModel } from '../../../../domain/models/survey';
import { SurveyResultModel } from '../../../../domain/models/survey-result';

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
  },

  mapSurvey(collection: any): SurveyModel {
    const { _id, ...collectionWithoutId } = collection;
    return Object.assign({}, collectionWithoutId, { id: _id });
  },

  mapSurveyResult(collection: any): SurveyResultModel {
    const { _id, ...collectionWithoutId } = collection;
    return Object.assign({}, collectionWithoutId, { id: _id });
  }
};
