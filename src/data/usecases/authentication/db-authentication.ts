import {
  Authentication,
  AuthenticationModel,
  LoadAccountByEmailRepository
} from './db-authentication-protocols';

export class DbAuthentication implements Authentication {
  constructor(
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  ) {}
  async authenticate(authentication: AuthenticationModel): Promise<string> {
    await this.loadAccountByEmailRepository.loadAccount(authentication.email);
    return null;
  }
}
