import {
  AddAccount,
  Authentication,
  Controller,
  HttpRequest,
  HttpResponse,
  Validation
} from './signup-protocols';
import {
  badRequest,
  forbidden,
  ok,
  serverError
} from '../../helpers/http/http-helper';
import { EmailInUseError } from '../../errors';

export class SignupController implements Controller {
  constructor(
    private readonly addAccount: AddAccount,
    private readonly validation: Validation,
    private readonly authentication: Authentication
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const { name, password, email } = httpRequest.body;

    try {
      const validationError = this.validation.validate(httpRequest.body);
      if (validationError) {
        return badRequest(validationError);
      }

      const newAccount = await this.addAccount.add({
        name,
        password,
        email
      });

      if (!newAccount) return forbidden(new EmailInUseError());

      const authenticationModel = await this.authentication.authenticate({
        email,
        password
      });
      return ok({ ...newAccount, ...authenticationModel });
    } catch (e) {
      return serverError(e);
    }
  }
}
