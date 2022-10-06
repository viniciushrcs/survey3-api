export interface Authentication {
  authenticate(email: string, password: string): Promise<string>;
}
