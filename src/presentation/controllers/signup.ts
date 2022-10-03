import {
  Controller,
  EmailValidator,
  HttpRequest,
  HttpResponse
} from '../protocols';
import { InvalidParamError, MissingParamError } from '../errors';
import { badRequest, serverError } from '../helpers/http-helper';
import { AddAccount } from '../../domain/use-cases/add-account';

export class SignupController implements Controller {
  private readonly emailValidator: EmailValidator;
  private readonly addAccount: AddAccount;

  constructor(emailValidator: EmailValidator, addAccount: AddAccount) {
    this.emailValidator = emailValidator;
    this.addAccount = addAccount;
  }

  handle(httpRequest: HttpRequest): HttpResponse {
    const { name, password, passwordConfirmation, email } = httpRequest.body;

    try {
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

      this.addAccount.add({
        name,
        password,
        email
      });
    } catch (e) {
      // o erro capturado no catch poderia ser logado em um serviço de monitoramento
      // não é uma boa prática retornar para o cliente
      return serverError();
    }
  }
}
