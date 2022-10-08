export interface UpdateAccessTokenRepository {
  update(id: string, authToken: string): Promise<void>;
}
