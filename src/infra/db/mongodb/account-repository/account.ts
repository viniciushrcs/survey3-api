import { AddAccountRepository } from '../../../../data/protocols/db/account/add-account-repository';
import { AddAccountParams } from '../../../../domain/usecases/account/add-account';
import { AccountModel } from '../../../../domain/models/account';
import { MongoHelper } from '../helpers';
import { LoadAccountByEmailRepository } from '../../../../data/protocols/db/account/load-account-by-email-repository';
import { UpdateAccessTokenRepository } from '../../../../data/protocols/db/account/update-access-token-repository';
import { LoadAccountByTokenRepository } from '../../../../data/protocols/db/account/load-account-by-token-repository';
import { CheckAccountByEmailRepository } from '../../../../data/protocols/db/account/check-account-by-email-repository';

export class AccountMongoRepository
  implements
    AddAccountRepository,
    LoadAccountByEmailRepository,
    LoadAccountByTokenRepository,
    UpdateAccessTokenRepository,
    CheckAccountByEmailRepository
{
  async add(account: AddAccountParams): Promise<AccountModel> {
    const accountCollection = MongoHelper.getCollection('accounts');
    await accountCollection.insertOne(account);
    return await this.loadAccountByEmail(account.email);
  }

  async checkByEmail(email: string): Promise<boolean> {
    const accountCollection = await MongoHelper.getCollection('accounts');
    const account = await accountCollection.findOne(
      {
        email
      },
      {
        projection: {
          _id: 1
        }
      }
    );
    return account !== null;
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
