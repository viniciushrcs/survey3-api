import { LogErrorDecorator } from './log-error';
import {
  Controller,
  HttpRequest,
  HttpResponse
} from '../../presentation/protocols';
import { ok, serverError } from '../../presentation/helpers/http/http-helper';
import { LogErrorRepository } from '../../data/protocols/db/log/log-error-repository';
import { AccountModel } from '../../domain/models/account';

interface SutTypes {
  sut: LogErrorDecorator;
  controllerStub: Controller;
  loggerRepoStub: LogErrorRepository;
}

const makeControllerStub = () => {
  class ControllerStub implements Controller {
    handle(httpRequest: HttpRequest): Promise<HttpResponse> {
      return Promise.resolve(ok(makeFakeAccount()));
    }
  }
  return new ControllerStub();
};

const makeLoggerRepoStub = (): LogErrorRepository => {
  class LoggerRepositoryStub implements LogErrorRepository {
    async logError(stack: string): Promise<void> {
      return Promise.resolve();
    }
  }
  return new LoggerRepositoryStub();
};

const makeSut = (): SutTypes => {
  const controllerStub = makeControllerStub();
  const loggerRepoStub = makeLoggerRepoStub();
  const sut = new LogErrorDecorator(controllerStub, loggerRepoStub);
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

describe('LoggerDecorator', () => {
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

    const logSpy = jest.spyOn(loggerRepoStub, 'logError');
    jest
      .spyOn(controllerStub, 'handle')
      .mockResolvedValueOnce(makeServerError());
    await sut.handle(makeFakeRequest());
    expect(logSpy).toHaveBeenCalled();
    expect(logSpy).toHaveBeenCalledWith('any_stack');
  });
});
