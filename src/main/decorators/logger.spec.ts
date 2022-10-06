import { LoggerDecorator } from './logger';
import {
  Controller,
  HttpRequest,
  HttpResponse
} from '../../presentation/protocols';
import { serverError } from '../../presentation/helpers/http-helper';
import { LoggerRepository } from '../../data/protocols/logger-repository';

interface SutTypes {
  sut: LoggerDecorator;
  controllerStub: Controller;
  loggerRepoStub: LoggerRepository;
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

const makeLoggerRepoStub = (): LoggerRepository => {
  class LoggerRepositoryStub implements LoggerRepository {
    async log(stack: string): Promise<void> {
      return new Promise((resolve) => resolve());
    }
  }
  return new LoggerRepositoryStub();
};

const makeSut = (): SutTypes => {
  const controllerStub = makeControllerStub();
  const loggerRepoStub = makeLoggerRepoStub();
  const sut = new LoggerDecorator(controllerStub, loggerRepoStub);
  return {
    sut,
    controllerStub,
    loggerRepoStub
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

  test('Should call LoggerRepository with correct error when controller returns a server error', async () => {
    const { sut, controllerStub, loggerRepoStub } = makeSut();
    const httpRequest: HttpRequest = {
      body: {
        email: 'email@email.com',
        name: 'name',
        password: 'password',
        passwordConfirmation: 'password'
      }
    };
    const fakeError = new Error();
    fakeError.stack = 'any_stack';
    const error = serverError(fakeError);
    const logSpy = jest.spyOn(loggerRepoStub, 'log');
    jest.spyOn(controllerStub, 'handle').mockResolvedValueOnce(error);
    await sut.handle(httpRequest);
    expect(logSpy).toHaveBeenCalled();
    expect(logSpy).toHaveBeenCalledWith('any_stack');
  });
});
