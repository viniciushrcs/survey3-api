import { AccountModel } from '../../models/account';

export interface LoadAccountByToken {
  loadAccount(accessToken: string, role?: string): Promise<AccountModel>;
}
