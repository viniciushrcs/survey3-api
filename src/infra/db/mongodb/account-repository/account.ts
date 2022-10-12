import { AddAccountRepository } from '../../../../data/protocols/db/account/add-account-repository';
import { AddAccountModel } from '../../../../domain/usecases/account/add-account';
import { AccountModel } from '../../../../domain/models/account';
import { MongoHelper } from '../helpers/mongo-helper';
import { LoadAccountByEmailRepository } from '../../../../data/protocols/db/account/load-account-by-email-repository.ts';
import { UpdateAccessTokenRepository } from '../../../../data/protocols/db/account/update-access-token-repository';
import { LoadAccountByTokenRepository } from '../../../../data/protocols/db/account/load-account-by-token-repository';

export class AccountMongoRepository
  implements
    AddAccountRepository,
    LoadAccountByEmailRepository,
    LoadAccountByTokenRepository,
    UpdateAccessTokenRepository
{
  async add(account: AddAccountModel): Promise<AccountModel> {
    const accountCollection = MongoHelper.getCollection('accounts');
    await accountCollection.insertOne(account);
    return await this.loadAccountByEmail(account.email);
  }

  async loadAccountByEmail(email: string): Promise<AccountModel> {
    const accountCollection = MongoHelper.getCollection('accounts');
    const foundAccount = await accountCollection.findOne({ email });
    return foundAccount && MongoHelper.map<AccountModel>(foundAccount);
  }

  async updateAccessToken(id: string, accessToken: string): Promise<void> {
    const accountCollection = MongoHelper.getCollection('accounts');
    await accountCollection.updateOne(
      { _id: id },
      {
        $set: {
          accessToken
        }
      }
    );
  }

  async loadAccountByToken(
    token: string,
    role?: string
  ): Promise<AccountModel> {
    const accountCollection = MongoHelper.getCollection('accounts');
    const foundAccount = await accountCollection.findOne({
      accessToken: token,
      $or: [
        {
          role
        },
        {
          role: 'admin'
        }
      ]
    });
    return foundAccount && MongoHelper.map<AccountModel>(foundAccount);
  }
}
