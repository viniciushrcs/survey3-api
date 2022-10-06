import { Controller, HttpRequest, HttpResponse } from '../../protocols';
import { badRequest } from '../../helpers/http-helper';
import { InvalidParamError, MissingParamError } from '../../errors';
import { EmailValidator } from '../../protocols/email-validator';

export class LoginController implements Controller {
  constructor(private readonly emailValidator: EmailValidator) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const { password, email } = httpRequest.body;

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
  }
}
