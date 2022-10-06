import { LoggerDecorator } from './logger';
import {
  Controller,
  HttpRequest,
  HttpResponse
} from '../../presentation/protocols';
import { ok, serverError } from '../../presentation/helpers/http-helper';
import { LoggerRepository } from '../../data/protocols/logger-repository';
import { AccountModel } from '../../domain/models/account';

interface SutTypes {
  sut: LoggerDecorator;
  controllerStub: Controller;
  loggerRepoStub: LoggerRepository;
}

const makeControllerStub = () => {
  class ControllerStub implements Controller {
    handle(httpRequest: HttpRequest): Promise<HttpResponse> {
      return new Promise((resolve) => resolve(ok(makeFakeAccount())));
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

const makeFakeRequest = (): HttpRequest => ({
  body: {
    name: 'crash',
    email: 'email@email.com',
    password: 'mGcMhu6P',
    passwordConfirmation: 'mGcMhu6P'
  }
});

const makeFakeAccount = (): AccountModel => ({
  id: 'aa672452-0ca0-468d-b321-f724adab617e',
  name: 'crash',
  email: 'email@email.com',
  password: 'mGcMhu6P'
});

const makeServerError = (): HttpResponse => {
  const fakeError = new Error();
  fakeError.stack = 'any_stack';
  return serverError(fakeError);
};

describe('LoggerDeccorator', () => {
  test('Should call controller handle properly', async () => {
    const { sut, controllerStub } = makeSut();
    const handleSpy = jest.spyOn(controllerStub, 'handle');
    await sut.handle(makeFakeRequest());
    expect(handleSpy).toHaveBeenCalled();
  });

  test('Should call controller handle with correct values', async () => {
    const { sut, controllerStub } = makeSut();
    const handleSpy = jest.spyOn(controllerStub, 'handle');
    await sut.handle(makeFakeRequest());
    expect(handleSpy).toHaveBeenCalledWith(makeFakeRequest());
  });

  test('Should return the exact value returned by Controller', async () => {
    const { sut } = makeSut();
    const response = await sut.handle(makeFakeRequest());
    expect(response).toEqual(ok(makeFakeAccount()));
  });

  test('Should call LoggerRepository with correct error when controller returns a server error', async () => {
    const { sut, controllerStub, loggerRepoStub } = makeSut();

    const logSpy = jest.spyOn(loggerRepoStub, 'log');
    jest
      .spyOn(controllerStub, 'handle')
      .mockResolvedValueOnce(makeServerError());
    await sut.handle(makeFakeRequest());
    expect(logSpy).toHaveBeenCalled();
    expect(logSpy).toHaveBeenCalledWith('any_stack');
  });
});
