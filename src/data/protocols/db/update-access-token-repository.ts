export interface UpdateAccessTokenRepository {
  updateAccessToken(id: string, authToken: string): Promise<void>;
}
