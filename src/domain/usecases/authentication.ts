export interface AuthenticationModel {
  email: string;
  password: string;
}

export interface Authentication {
  authenticate(authentication: AuthenticationModel): Promise<string>;
}
