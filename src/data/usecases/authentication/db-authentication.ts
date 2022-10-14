import {
  Authentication,
  AuthenticationModel,
  AuthenticationParams,
  HashComparer,
  LoadAccountByEmailRepository,
  TokenGenerator,
  UpdateAccessTokenRepository
} from './db-authentication-protocols';

export class DbAuthentication implements Authentication {
  constructor(
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashComparer: HashComparer,
    private readonly tokenGenerator: TokenGenerator,
    private readonly updateAccessTokenRepository: UpdateAccessTokenRepository
  ) {}
  async authenticate(
    authentication: AuthenticationParams
  ): Promise<AuthenticationModel> {
    let accessToken = null;
    let isPasswordValid = false;

    const account = await this.loadAccountByEmailRepository.loadAccountByEmail(
      authentication.email
    );
    if (account) {
      isPasswordValid = await this.hashComparer.compare(
        authentication.password,
        account.password
      );
    }

    if (isPasswordValid) {
      accessToken = await this.tokenGenerator.generate(account.id);
    }

    if (accessToken) {
      await this.updateAccessTokenRepository.updateAccessToken(
        account.id,
        accessToken
      );
      return { accessToken, name: account.name };
    }
    return null;
  }
}
