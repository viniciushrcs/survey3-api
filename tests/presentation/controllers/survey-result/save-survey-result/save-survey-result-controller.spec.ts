import { SaveSurveyResultController } from '../../../../../src/presentation/controllers/survey-result/save-survey-result/save-survey-result-controller';
import {
  HttpRequest,
  LoadSurveyById,
  SaveSurveyResult,
  SaveSurveyResultParams,
  SurveyModel,
  SurveyResultModel
} from '../../../../../src/presentation/controllers/survey-result/save-survey-result/save-survey-result-controller-protocols';
import MockDate from 'mockdate';
import {
  forbidden,
  ok,
  serverError
} from '../../../../../src/presentation/helpers/http/http-helper';
import {
  InvalidParamError,
  ServerError
} from '../../../../../src/presentation/errors';

const makeSurveyResult = (): SurveyResultModel => ({
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

interface SutTypes {
  sut: SaveSurveyResultController;
  saveSurveyResultStub: SaveSurveyResult;
  loadSurveyByIdStub: LoadSurveyById;
}

const makeLoadSurveyById = (): LoadSurveyById => {
  class LoadSurveyByIdStub implements LoadSurveyById {
    async loadById(id: string): Promise<SurveyModel> {
      return Promise.resolve(makeFakeSurvey());
    }
  }
  return new LoadSurveyByIdStub();
};

const makeSaveSurveyResultStub = (): SaveSurveyResult => {
  class SaveSurveyResultStub implements SaveSurveyResult {
    async save(
      surveyResult: SaveSurveyResultParams
    ): Promise<SurveyResultModel> {
      return Promise.resolve(makeSurveyResult());
    }
  }
  return new SaveSurveyResultStub();
};

const makeSut = (): SutTypes => {
  const saveSurveyResultStub = makeSaveSurveyResultStub();
  const loadSurveyByIdStub = makeLoadSurveyById();
  const sut = new SaveSurveyResultController(
    loadSurveyByIdStub,
    saveSurveyResultStub
  );
  return {
    sut,
    saveSurveyResultStub,
    loadSurveyByIdStub
  };
};

const makeFakeRequest = (): HttpRequest => ({
  params: {
    surveyId: 'any_id'
  },
  body: {
    answer: 'any_answer'
  },
  userId: 'userId'
});

describe('SaveSurveyResult Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset;
  });

  describe('LoadSurveyById', () => {
    test('Should call LoadSurveyById with correct values', async () => {
      const { sut, loadSurveyByIdStub } = makeSut();
      const loadByIdSpy = jest.spyOn(loadSurveyByIdStub, 'loadById');
      await sut.handle(makeFakeRequest());
      expect(loadByIdSpy).toHaveBeenCalledWith('any_id');
    });

    test('Should return 403 if LoadSurveyById returns null', async () => {
      const { sut, loadSurveyByIdStub } = makeSut();
      jest.spyOn(loadSurveyByIdStub, 'loadById').mockResolvedValueOnce(null);

      const response = await sut.handle(makeFakeRequest());
      expect(response).toEqual(forbidden(new InvalidParamError('surveyId')));
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

  describe('Answer validation', () => {
    test('Should return 403 if an invalid answer is provided', async () => {
      const { sut } = makeSut();
      const response = await sut.handle({
        params: {
          surveyId: 'any_id'
        },
        body: 'wrong_answer'
      });
      expect(response).toEqual(forbidden(new InvalidParamError('answer')));
    });
  });

  describe('SaveSurveyResult', () => {
    test('Should call SaveSurveyResult with correct values', async () => {
      const { sut, saveSurveyResultStub } = makeSut();
      const saveSpy = jest.spyOn(saveSurveyResultStub, 'save');
      await sut.handle(makeFakeRequest());
      expect(saveSpy).toHaveBeenCalledWith({
        surveyId: 'any_id',
        answer: 'any_answer',
        userId: 'userId',
        date: new Date()
      });
    });

    test('Should return 500 if SaveSurveyResult throws', async () => {
      const { sut, saveSurveyResultStub } = makeSut();
      jest
        .spyOn(saveSurveyResultStub, 'save')
        .mockRejectedValueOnce(async () => {
          throw new Error();
        });
      const httpResponse = await sut.handle(makeFakeRequest());
      expect(httpResponse).toEqual(serverError(new ServerError(null)));
    });

    test('Should return 200 on SaveSurveyResult success', async () => {
      const { sut } = makeSut();
      const httpResponse = await sut.handle(makeFakeRequest());
      expect(httpResponse).toEqual(ok(makeSurveyResult()));
    });
  });
});
