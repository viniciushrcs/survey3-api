import {
  AccountModel,
  AddAccount,
  AddAccountParams,
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
  async add(account: AddAccountParams): Promise<AccountModel> {
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
