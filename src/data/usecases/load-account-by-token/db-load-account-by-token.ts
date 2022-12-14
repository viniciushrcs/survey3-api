import {
  AccountModel,
  LoadAccountByToken,
  LoadAccountByTokenRepository,
  TokenVerifier
} from './db-load-account-by-token-protocols';

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor(
    private readonly tokenVerifier: TokenVerifier,
    private readonly loadAccountByTokenRepository: LoadAccountByTokenRepository
  ) {}
  async loadAccount(accessToken: string, role?: string): Promise<AccountModel> {
    let token: string;
    try {
      token = await this.tokenVerifier.verify(accessToken);
    } catch (e) {
      return null;
    }
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
