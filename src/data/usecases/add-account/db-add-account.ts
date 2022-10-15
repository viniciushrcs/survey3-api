import {
  AccountModel,
  AddAccount,
  AddAccountParams,
  AddAccountRepository,
  CheckAccountByEmailRepository,
  Encrypter
} from './db-add-account-protocols';

export class DbAddAccount implements AddAccount {
  constructor(
    private readonly encrypter: Encrypter,
    private readonly addAccountRepository: AddAccountRepository,
    private readonly checkAccountByEmailRepository: CheckAccountByEmailRepository
  ) {}
  async add(account: AddAccountParams): Promise<AccountModel> {
    const hasAlreadyAccount =
      await this.checkAccountByEmailRepository.checkByEmail(account.email);
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
