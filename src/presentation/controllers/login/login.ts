import {
  badRequest,
  ok,
  serverError,
  unauthorized
} from '../../helpers/http/http-helper';
import {
  Authentication,
  Controller,
  HttpRequest,
  HttpResponse,
  Validation
} from './login-protocols';

export class LoginController implements Controller {
  constructor(
    private readonly validation: Validation,
    private readonly authentication: Authentication
  ) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const { password, email } = httpRequest.body;
    try {
      const validationError = this.validation.validate(httpRequest.body);
      if (validationError) {
        return badRequest(validationError);
      }

      const accessToken = await this.authentication.authenticate({
        email,
        password
      });
      if (!accessToken) {
        return unauthorized();
      }
      return ok({ accessToken });
    } catch (e) {
      return serverError(e);
    }
  }
}
