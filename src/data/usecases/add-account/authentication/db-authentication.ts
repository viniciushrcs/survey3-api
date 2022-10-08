import {
  Authentication,
  AuthenticationModel
} from '../../../../domain/usecases/authentication';
import { LoadAccountByEmailRepository } from '../../../protocols/load-account-by-email-repository.ts';

export class DbAuthentication implements Authentication {
  constructor(
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  ) {}
  async authenticate(authentication: AuthenticationModel): Promise<string> {
    await this.loadAccountByEmailRepository.loadAccount(authentication.email);
    return new Promise((resolve) => resolve(''));
  }
}
