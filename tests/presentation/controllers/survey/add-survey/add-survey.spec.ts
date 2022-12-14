import { AddSurveyController } from '../../../../../src/presentation/controllers/survey/add-survey/add-survey-controller';
import {
  AddSurvey,
  AddSurveyParams,
  HttpRequest,
  Validation
} from '../../../../../src/presentation/controllers/survey/add-survey/add-survey-protocols';
import {
  MissingParamError,
  ServerError
} from '../../../../../src/presentation/errors';
import {
  badRequest,
  noContent,
  serverError
} from '../../../../../src/presentation/helpers/http/http-helper';
import MockDate from 'mockdate';

interface SutTypes {
  sut: AddSurveyController;
  addSurveyStub: AddSurvey;
  validationStub: Validation;
}

const makeAddSurvey = (): AddSurvey => {
  class AddSurveyStub implements AddSurvey {
    async add(survey: AddSurveyParams): Promise<void> {
      return Promise.resolve();
    }
  }
  return new AddSurveyStub();
};

const makeFakeRequest = (): HttpRequest => ({
  body: {
    question: 'any_question',
    answers: [
      {
        image: 'any_image',
        answer: 'any_answer'
      }
    ],
    date: new Date()
  }
});

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate(input: any): Error {
      return null;
    }
  }
  return new ValidationStub();
};

const makeSut = (): SutTypes => {
  const validationStub = makeValidation();
  const addSurveyStub = makeAddSurvey();
  const sut = new AddSurveyController(validationStub, addSurveyStub);
  return {
    sut,
    validationStub,
    addSurveyStub
  };
};

describe('AddSurvey Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset;
  });

  describe('AddSurvey', () => {
    test('Should call AddSurvey with correct values', async () => {
      const { sut, addSurveyStub } = makeSut();
      const addSpy = jest.spyOn(addSurveyStub, 'add');
      await sut.handle(makeFakeRequest());
      expect(addSpy).toHaveBeenCalledWith(makeFakeRequest().body);
    });

    test('Should return 500 if AddSurvey throws', async () => {
      const { sut, addSurveyStub } = makeSut();
      jest.spyOn(addSurveyStub, 'add').mockRejectedValueOnce(async () => {
        throw new Error();
      });
      const httpResponse = await sut.handle(makeFakeRequest());
      expect(httpResponse).toEqual(serverError(new ServerError(null)));
    });

    test('Should return 204 on success', async () => {
      const { sut } = makeSut();
      const httpResponse = await sut.handle(makeFakeRequest());
      expect(httpResponse).toEqual(noContent());
    });
  });

  describe('Validation', () => {
    test('Should validate obligatory data', async () => {
      const { sut, validationStub } = makeSut();
      const addSpy = jest.spyOn(validationStub, 'validate');
      await sut.handle(makeFakeRequest());
      expect(addSpy).toHaveBeenCalledWith(makeFakeRequest().body);
    });

    test('Should return 400 if Validation is returns an error', async () => {
      const { sut, validationStub } = makeSut();
      jest
        .spyOn(validationStub, 'validate')
        .mockReturnValueOnce(new MissingParamError('any_field'));
      const httpResponse = await sut.handle(makeFakeRequest());
      expect(httpResponse).toEqual(
        badRequest(new MissingParamError('any_field'))
      );
    });
  });
});
