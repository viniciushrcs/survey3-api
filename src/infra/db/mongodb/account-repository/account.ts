import { AddAccountRepository } from '../../../../data/protocols/add-account-repository';
import { AddAccountModel } from '../../../../domain/usecases/add-account';
import { AccountModel } from '../../../../domain/models/account';
import { MongoHelper } from '../helpers/mongo-helper';

export class AccountMongoRepository implements AddAccountRepository {
  //todo refatorar esse método
  async add(account: AddAccountModel): Promise<AccountModel> {
    const accountCollection = MongoHelper.getCollection('accounts');
    await accountCollection.insertOne(account);
    const newAccount = await accountCollection.findOne({
      email: account.email
    });
    const id = newAccount._id.toString();
    return {
      id,
      name: newAccount.name,
      email: newAccount.email,
      password: newAccount.password
    };
  }
}
