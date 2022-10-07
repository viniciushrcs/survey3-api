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

      const authToken = await this.authentication.authenticate(email, password);
      if (!authToken) {
        return unauthorized();
      }
      return ok({ authToken });
    } catch (e) {
      return serverError(e);
    }
  }
}
