import { LoadSurveysController } from '../../../../../src/presentation/controllers/survey/load-survey/load-surveys';
import {
  HttpRequest,
  LoadSurveys,
  SurveyModel
} from '../../../../../src/presentation/controllers/survey/load-survey/load-surveys-protocols';
import {
  noContent,
  ok,
  serverError
} from '../../../../../src/presentation/helpers/http/http-helper';
import MockDate from 'mockdate';
import { ServerError } from '../../../../../src/presentation/errors';

const makeFakeSurveys = (): SurveyModel[] => [
  {
    id: 'any_id',
    question: 'any_question',
    answers: [
      {
        image: 'any_image',
        answer: 'any_answer'
      }
    ],
    date: new Date()
  },
  {
    id: 'other_id',
    question: 'other_question',
    answers: [
      {
        image: 'other_image',
        answer: 'other_answer'
      }
    ],
    date: new Date()
  }
];

interface SutTypes {
  sut: LoadSurveysController;
  loadSurveysStub: LoadSurveys;
}

describe('Load Surveys Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset;
  });

  const makeLoadSurveysStub = () => {
    class LoadSurveysStub implements LoadSurveys {
      async load(): Promise<SurveyModel[]> {
        return Promise.resolve(makeFakeSurveys());
      }
    }
    return new LoadSurveysStub();
  };

  const makeSut = (): SutTypes => {
    const loadSurveysStub = makeLoadSurveysStub();
    const sut = new LoadSurveysController(loadSurveysStub);
    return {
      sut,
      loadSurveysStub
    };
  };

  const mockRequest = (): HttpRequest => ({ userId: 'any_user_id' });

  describe('LoadSurveys', () => {
    test('Should call LoadSurveys', async () => {
      const { sut, loadSurveysStub } = makeSut();
      const loadSpy = jest.spyOn(loadSurveysStub, 'load');
      await sut.handle(mockRequest());
      expect(loadSpy).toHaveBeenCalled();
      expect(loadSpy).toHaveBeenCalledWith('any_user_id');
    });

    test('Should return 500 if LoadSurveys throws', async () => {
      const { sut, loadSurveysStub } = makeSut();
      jest.spyOn(loadSurveysStub, 'load').mockRejectedValueOnce(async () => {
        throw new Error();
      });
      const httpResponse = await sut.handle(mockRequest());
      expect(httpResponse).toEqual(serverError(new ServerError(null)));
    });

    test('Should return 204 if LoadSurveys returns empy', async () => {
      const { sut, loadSurveysStub } = makeSut();
      jest.spyOn(loadSurveysStub, 'load').mockResolvedValueOnce([]);
      const httpResponse = await sut.handle(mockRequest());
      expect(httpResponse).toEqual(noContent());
    });

    test('Should return 200 on success', async () => {
      const { sut } = makeSut();
      const httpResponse = await sut.handle(mockRequest());
      expect(httpResponse).toEqual(ok(makeFakeSurveys()));
    });
  });
});
