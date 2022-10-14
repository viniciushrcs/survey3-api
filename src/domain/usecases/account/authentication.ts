import { AuthenticationModel } from '../../models/authentication';

export interface AuthenticationParams {
  email: string;
  password: string;
}

export interface Authentication {
  authenticate(
    authentication: AuthenticationParams
  ): Promise<AuthenticationModel>;
}
