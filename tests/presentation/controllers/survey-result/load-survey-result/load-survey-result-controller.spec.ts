import { LoadSurveyResultController } from '../../../../../src/presentation/controllers/survey-result/load-survey-result/load-survey-result-controller';
import {
  CheckSurveyById,
  HttpRequest,
  LoadSurveyResult
} from '../../../../../src/presentation/controllers/survey-result/load-survey-result/load-survey-result-controller-protocols';
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
  checkSurveyByIdStub: CheckSurveyById;
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

const makeCheckSurveyById = () => {
  class CheckSurveyByIdStub implements CheckSurveyById {
    async checkById(id: string): Promise<boolean> {
      return Promise.resolve(true);
    }
  }
  return new CheckSurveyByIdStub();
};

const makeSut = (): SutTypes => {
  const checkSurveyByIdStub = makeCheckSurveyById();
  const loadSurveyResultStub = makeLoadSurveyResult();
  const sut = new LoadSurveyResultController(
    checkSurveyByIdStub,
    loadSurveyResultStub
  );
  return {
    sut,
    checkSurveyByIdStub,
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
  describe('CheckSurveyById', () => {
    test('Should call CheckSurveyById with correct value', async () => {
      const { sut, checkSurveyByIdStub } = makeSut();
      const checkByIdSpy = jest.spyOn(checkSurveyByIdStub, 'checkById');
      await sut.handle(makeFakeRequest());
      expect(checkByIdSpy).toHaveBeenCalledWith('any_id');
    });

    test('Should return 403 if CheckSurveyById returns null', async () => {
      const { sut, checkSurveyByIdStub } = makeSut();
      jest.spyOn(checkSurveyByIdStub, 'checkById').mockResolvedValueOnce(null);
      const httpResponse = await sut.handle(makeFakeRequest());
      expect(httpResponse).toEqual(
        forbidden(new InvalidParamError('surveyId'))
      );
    });

    test('Should return 500 if CheckSurveyById throws', async () => {
      const { sut, checkSurveyByIdStub } = makeSut();
      jest
        .spyOn(checkSurveyByIdStub, 'checkById')
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
