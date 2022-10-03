import {
  Controller,
  EmailValidator,
  HttpRequest,
  HttpResponse
} from '../protocols';
import { InvalidParamError, MissingParamError } from '../errors';
import { badRequest, serverError } from '../helpers/http-helper';

export class SignupController implements Controller {
  private readonly emailValidator: EmailValidator;

  constructor(emailValidator: EmailValidator) {
    this.emailValidator = emailValidator;
  }

  handle(httpRequest: HttpRequest): HttpResponse {
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
      const isPasswordConfirmationMatching =
        httpRequest.body.password === httpRequest.body.passwordConfirmation;
      if (!isPasswordConfirmationMatching) {
        return badRequest(new InvalidParamError('passwordConfirmation'));
      }
      const isEmailValid = this.emailValidator.isValid(httpRequest.body.email);
      if (!isEmailValid) {
        return badRequest(new InvalidParamError('email'));
      }
    } catch (e) {
      // o erro capturado no catch poderia ser logado em um serviço de monitoramento
      // não é uma boa prática retornar para o cliente
      return serverError();
    }
  }
}
