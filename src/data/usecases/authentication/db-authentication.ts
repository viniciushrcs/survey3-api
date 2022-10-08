import {
  Authentication,
  AuthenticationModel,
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
  async authenticate(authentication: AuthenticationModel): Promise<string> {
    let authToken = null;
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
      authToken = await this.tokenGenerator.generate(account.id);
    }

    if (authToken) {
      await this.updateAccessTokenRepository.updateAccessToken(
        account.id,
        authToken
      );
    }
    return authToken;
  }
}
