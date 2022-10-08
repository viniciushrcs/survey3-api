import {
  Authentication,
  AuthenticationModel,
  HashComparer,
  LoadAccountByEmailRepository
} from './db-authentication-protocols';

export class DbAuthentication implements Authentication {
  constructor(
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashComparer: HashComparer
  ) {}
  async authenticate(authentication: AuthenticationModel): Promise<string> {
    const account = await this.loadAccountByEmailRepository.loadAccount(
      authentication.email
    );
    if (account) {
      const isCorrectPassword = await this.hashComparer.compare(
        authentication.password,
        account.password
      );
    }
    return null;
  }
}
