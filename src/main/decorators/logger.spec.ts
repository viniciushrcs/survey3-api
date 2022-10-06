import { LoggerDecorator } from './logger';
import {
  Controller,
  HttpRequest,
  HttpResponse
} from '../../presentation/protocols';

interface SutTypes {
  sut: LoggerDecorator;
  controllerStub: Controller;
}

const makeControllerStub = () => {
  class ControllerStub implements Controller {
    handle(httpRequest: HttpRequest): Promise<HttpResponse> {
      return new Promise((resolve) =>
        resolve({
          statusCode: 200,
          body: {
            email: 'email@email.com',
            name: 'name',
            password: 'password'
          }
        })
      );
    }
  }
  return new ControllerStub();
};

const makeSut = (): SutTypes => {
  const controllerStub = makeControllerStub();
  const sut = new LoggerDecorator(controllerStub);
  return {
    sut,
    controllerStub
  };
};

describe('LoggerDeccorator', () => {
  test('Should call controller handle properly', async () => {
    const { sut, controllerStub } = makeSut();
    const httpRequest: HttpRequest = {
      body: {
        email: 'email@email.com',
        name: 'name',
        password: 'password',
        passwordConfirmation: 'password'
      }
    };
    const handleSpy = jest.spyOn(controllerStub, 'handle');
    await sut.handle(httpRequest);
    expect(handleSpy).toHaveBeenCalled();
  });

  test('Should call controller handle with correct values', async () => {
    const { sut, controllerStub } = makeSut();
    const httpRequest: HttpRequest = {
      body: {
        email: 'email@email.com',
        name: 'name',
        password: 'password',
        passwordConfirmation: 'password'
      }
    };
    const handleSpy = jest.spyOn(controllerStub, 'handle');
    await sut.handle(httpRequest);
    expect(handleSpy).toHaveBeenCalledWith(httpRequest);
  });

  test('Should return the exact value returned by Controller', async () => {
    const { sut } = makeSut();
    const httpRequest: HttpRequest = {
      body: {
        email: 'email@email.com',
        name: 'name',
        password: 'password',
        passwordConfirmation: 'password'
      }
    };
    const response = await sut.handle(httpRequest);
    expect(response).toEqual({
      statusCode: 200,
      body: {
        email: 'email@email.com',
        name: 'name',
        password: 'password'
      }
    });
  });
});
