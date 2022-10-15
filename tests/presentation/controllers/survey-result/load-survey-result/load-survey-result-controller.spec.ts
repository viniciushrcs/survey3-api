import { LoadSurveyResultController } from '../../../../../src/presentation/controllers/survey-result/load-survey-result/load-survey-result-controller';
import {
  HttpRequest,
  LoadSurveyById,
  LoadSurveyResult
} from '../../../../../src/presentation/controllers/survey-result/load-survey-result/load-survey-result-controller-protocols';
import { SurveyModel } from '../../../../../src/domain/models/survey';
import {
  forbidden,
  ok,
  serverError
} from '../../../../../src/presentation/helpers/http/http-helper';
import {
  InvalidParamError,
  ServerError
} from '../../../../../src/presentation/errors';
import { SurveyResultModel } from '../../../../../src/domain/models/survey-result';
import MockDate from 'mockdate';

const makeFakeRequest = (): HttpRequest => ({
  params: {
    surveyId: 'any_id'
  }
});

const makeFakeSurvey = (): SurveyModel => ({
  id: 'any_id',
  question: 'any_question',
  answers: [
    {
      image: 'any_image',
      answer: 'any_answer'
    }
  ],
  date: new Date()
});

const makeSaveSurveyResultModel = (): SurveyResultModel => ({
  surveyId: 'any_survey_id',
  question: 'any_question',
  answers: [
    {
      image: 'any_image',
      answer: 'any_answer',
      count: 1,
      percent: 10
    }
  ],
  date: new Date()
});

type SutTypes = {
  sut: LoadSurveyResultController;
  loadSurveyByIdStub: LoadSurveyById;
  loadSurveyResultStub: LoadSurveyResult;
};

const makeLoadSurveyResult = () => {
  class LoadSurveyResultStub implements LoadSurveyResult {
    async load(surveyId: string): Promise<SurveyResultModel> {
      return Promise.resolve(makeSaveSurveyResultModel());
    }
  }
  return new LoadSurveyResultStub();
};

const makeLoadSurveyById = () => {
  class LoadSurveyByIdStub implements LoadSurveyById {
    async loadById(id: string): Promise<SurveyModel> {
      return Promise.resolve(makeFakeSurvey());
    }
  }
  return new LoadSurveyByIdStub();
};

const makeSut = (): SutTypes => {
  const loadSurveyByIdStub = makeLoadSurveyById();
  const loadSurveyResultStub = makeLoadSurveyResult();
  const sut = new LoadSurveyResultController(
    loadSurveyByIdStub,
    loadSurveyResultStub
  );
  return {
    sut,
    loadSurveyByIdStub,
    loadSurveyResultStub
  };
};

describe('LoadSurveyResult Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset;
  });
  describe('LoadSurveyById', () => {
    test('Should call LoadSurveyById with correct value', async () => {
      const { sut, loadSurveyByIdStub } = makeSut();
      const loadByIdSpy = jest.spyOn(loadSurveyByIdStub, 'loadById');
      await sut.handle(makeFakeRequest());
      expect(loadByIdSpy).toHaveBeenCalledWith('any_id');
    });

    test('Should return 403 if LoadSurveyById returns null', async () => {
      const { sut, loadSurveyByIdStub } = makeSut();
      jest.spyOn(loadSurveyByIdStub, 'loadById').mockResolvedValueOnce(null);
      const httpResponse = await sut.handle(makeFakeRequest());
      expect(httpResponse).toEqual(
        forbidden(new InvalidParamError('surveyId'))
      );
    });

    test('Should return 500 if LoadSurveyById throws', async () => {
      const { sut, loadSurveyByIdStub } = makeSut();
      jest
        .spyOn(loadSurveyByIdStub, 'loadById')
        .mockRejectedValueOnce(async () => {
          throw new Error();
        });
      const httpResponse = await sut.handle(makeFakeRequest());
      expect(httpResponse).toEqual(serverError(new ServerError(null)));
    });
  });

  describe('LoadSurveyResult', () => {
    test('Should call LoadSurveyResult with correct value', async () => {
      const { sut, loadSurveyResultStub } = makeSut();
      const loadSpy = jest.spyOn(loadSurveyResultStub, 'load');
      await sut.handle(makeFakeRequest());
      expect(loadSpy).toHaveBeenCalledWith('any_id');
    });

    test('Should return 500 if LoadSurveyResult throws', async () => {
      const { sut, loadSurveyResultStub } = makeSut();
      jest
        .spyOn(loadSurveyResultStub, 'load')
        .mockImplementationOnce(async () => {
          throw new Error();
        });
      const httpResponse = await sut.handle(makeFakeRequest());
      expect(httpResponse).toEqual(serverError(new Error()));
    });

    test('Should return 200 on success', async () => {
      const { sut } = makeSut();
      const httpResponse = await sut.handle(makeFakeRequest());
      expect(httpResponse).toEqual(ok(makeSaveSurveyResultModel()));
    });
  });
});
