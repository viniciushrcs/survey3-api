import {
  AccountModel,
  Decrypter,
  LoadAccountByToken,
  LoadAccountByTokenRepository
} from './db-load-account-by-token-protocols';

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor(
    private readonly decrypter: Decrypter,
    private readonly loadAccountByTokenRepository: LoadAccountByTokenRepository
  ) {}
  async loadAccount(accessToken: string, role?: string): Promise<AccountModel> {
    const token = await this.decrypter.decrypt(accessToken);
    let account = null;

    if (token) {
      account = await this.loadAccountByTokenRepository.loadAccountByToken(
        accessToken,
        role
      );
    }

    if (account) {
      return account;
    }

    return null;
  }
}
