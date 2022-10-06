import { HttpRequest } from '../../protocols';
import { badRequest } from '../../helpers/http-helper';
import { MissingParamError } from '../../errors';
import { LoginController } from './login';

describe('Login Controller', () => {
  const makeSut = () => {
    return new LoginController();
  };

  test('Should return 400 if no email is provided', async () => {
    const sut = makeSut();
    const httpRequest: HttpRequest = {
      body: {
        password: 'password'
      }
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')));
  });

  test('Should return 400 if no password is provided', async () => {
    const sut = makeSut();
    const httpRequest: HttpRequest = {
      body: {
        email: 'email'
      }
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')));
  });
});
