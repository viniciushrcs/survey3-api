import {
  AddAccount,
  Controller,
  EmailValidator,
  HttpRequest,
  HttpResponse,
  Validation
} from './signup-protocols';
import { InvalidParamError } from '../../errors';
import { badRequest, ok, serverError } from '../../helpers/http-helper';

export class SignupController implements Controller {
  constructor(
    private readonly emailValidator: EmailValidator,
    private readonly addAccount: AddAccount,
    private readonly validation: Validation
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const { name, password, passwordConfirmation, email } = httpRequest.body;

    try {
      const validationError = this.validation.validate(httpRequest.body);
      if (validationError) {
        return badRequest(validationError);
      }

      const isPasswordConfirmationMatching = password === passwordConfirmation;
      if (!isPasswordConfirmationMatching) {
        return badRequest(new InvalidParamError('passwordConfirmation'));
      }
      const isEmailValid = this.emailValidator.isValid(email);
      if (!isEmailValid) {
        return badRequest(new InvalidParamError('email'));
      }

      const newAccount = await this.addAccount.add({
        name,
        password,
        email
      });
      return ok(newAccount);
    } catch (e) {
      // o erro capturado no catch poderia ser logado em um serviço de monitoramento
      // não é uma boa prática retornar para o cliente
      return serverError(e);
    }
  }
}
