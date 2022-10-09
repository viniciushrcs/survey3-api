import {
  AccountModel,
  AddAccount,
  AddAccountModel,
  AddAccountRepository,
  Encrypter,
  LoadAccountByEmailRepository
} from './db-add-account-protocols';

export class DbAddAccount implements AddAccount {
  constructor(
    private readonly encrypter: Encrypter,
    private readonly addAccountRepository: AddAccountRepository,
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  ) {}
  async add(account: AddAccountModel): Promise<AccountModel> {
    const hasAlreadyAccount =
      await this.loadAccountByEmailRepository.loadAccountByEmail(account.email);
    if (hasAlreadyAccount) {
      return null;
    }
    const encryptedPassword = await this.encrypter.encrypt(account.password);
    return await this.addAccountRepository.add({
      ...account,
      password: encryptedPassword
    });
  }
}
