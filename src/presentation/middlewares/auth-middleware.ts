import { forbidden, ok, serverError } from '../helpers/http/http-helper';
import { AccessDeniedError } from '../errors';
import {
  HttpRequest,
  HttpResponse,
  LoadAccountByToken,
  Middleware
} from './auth-middleware-protocols';

export class AuthMiddleware implements Middleware {
  constructor(
    private readonly loadAccountByToken: LoadAccountByToken,
    private readonly role?: string
  ) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const accessToken = httpRequest.headers?.['x-access-token'];
      let account = null;

      if (accessToken) {
        account = await this.loadAccountByToken.loadAccount(
          accessToken,
          this.role
        );
      }

      if (account) {
        return ok({ userId: account.id });
      }

      return forbidden(new AccessDeniedError());
    } catch (e) {
      return serverError(e);
    }
  }
}
