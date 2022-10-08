import { AddAccountRepository } from '../../../../data/protocols/db/add-account-repository';
import { AddAccountModel } from '../../../../domain/usecases/add-account';
import { AccountModel } from '../../../../domain/models/account';
import { MongoHelper } from '../helpers/mongo-helper';
import { LoadAccountByEmailRepository } from '../../../../data/protocols/db/load-account-by-email-repository.ts';

export class AccountMongoRepository
  implements AddAccountRepository, LoadAccountByEmailRepository
{
  async add(account: AddAccountModel): Promise<AccountModel> {
    const accountCollection = MongoHelper.getCollection('accounts');
    await accountCollection.insertOne(account);
    return await this.loadAccountByEmail(account.email);
  }

  async loadAccountByEmail(email: string): Promise<AccountModel> {
    const accountCollection = MongoHelper.getCollection('accounts');
    const foundAccount = await accountCollection.findOne({ email });
    return foundAccount && MongoHelper.mapAccount(foundAccount);
  }
}
