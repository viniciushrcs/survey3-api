import { AccountModel } from '../../domain/models/account';

export interface LoadAccountByEmailRepository {
  loadAccount(email: string): Promise<AccountModel>;
}
