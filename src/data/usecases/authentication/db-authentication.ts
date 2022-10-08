import {
  Authentication,
  AuthenticationModel,
  HashComparer,
  LoadAccountByEmailRepository,
  TokenGenerator
} from './db-authentication-protocols';

export class DbAuthentication implements Authentication {
  constructor(
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashComparer: HashComparer,
    private readonly tokenGenerator: TokenGenerator
  ) {}
  async authenticate(authentication: AuthenticationModel): Promise<string> {
    const account = await this.loadAccountByEmailRepository.loadAccount(
      authentication.email
    );
    if (account) {
      await this.hashComparer.compare(
        authentication.password,
        account.password
      );
      await this.tokenGenerator.generate(account.id);
    }
    return null;
  }
}
