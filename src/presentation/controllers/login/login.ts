import {
  badRequest,
  serverError,
  unauthorized
} from '../../helpers/http-helper';
import { InvalidParamError, MissingParamError } from '../../errors';
import {
  Authentication,
  Controller,
  EmailValidator,
  HttpRequest,
  HttpResponse
} from './login-protocols';

export class LoginController implements Controller {
  constructor(
    private readonly emailValidator: EmailValidator,
    private readonly authentication: Authentication
  ) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const { password, email } = httpRequest.body;
    try {
      const requiredFields = ['email', 'password'];
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field));
        }
      }
      const isEmailValid = this.emailValidator.isValid(email);
      if (!isEmailValid) {
        return badRequest(new InvalidParamError('email'));
      }
      const authToken = await this.authentication.authenticate(email, password);
      if (!authToken) {
        return unauthorized();
      }
    } catch (e) {
      return serverError(e);
    }
  }
}
