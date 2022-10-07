import {
  AddAccount,
  Controller,
  EmailValidator,
  HttpRequest,
  HttpResponse,
  Validation
} from './signup-protocols';
import { InvalidParamError, MissingParamError } from '../../errors';
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
      this.validation.validate(httpRequest.body);
      const requiredFields = [
        'name',
        'email',
        'password',
        'passwordConfirmation'
      ];
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field));
        }
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
